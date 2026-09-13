const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Student = require("../models/Student");
const sendJobPostedEmail = require("../utils/sendJobPostedEmail");
const { getDomainForRole } = require("../config/careerDomains");
const {
  getRecommendedJobsForStudent,
  calculateJobMatch,
} = require("../services/jobMatchingService");

/**
 * Sends in-app notifications and email alerts to legitimate student accounts for new drives
 */
const notifyStudentsNewJob = async (job, req = null) => {
  try {
    if (!job || job.status === "Closed" || job.status === "closed") return;

    // Find recruiter/admin emails to exclude
    const nonStudents = await User.find({ role: { $in: ["recruiter", "admin"] } }).select("email").lean();
    const excludedEmails = new Set(
      nonStudents.map((u) => (u.email ? u.email.toLowerCase().trim() : "")).filter(Boolean)
    );

    // Find legitimate student emails
    const [userStudents, studentProfiles] = await Promise.all([
      User.find({ role: "student" }).select("email name").lean(),
      Student.find({}).select("email name").lean(),
    ]);

    const studentMap = new Map(); // email -> name
    userStudents.forEach((u) => {
      const email = u.email ? u.email.toLowerCase().trim() : "";
      if (email && !excludedEmails.has(email)) {
        studentMap.set(email, u.name || "Student");
      }
    });

    studentProfiles.forEach((s) => {
      const email = s.email ? s.email.toLowerCase().trim() : "";
      if (email && !excludedEmails.has(email)) {
        if (!studentMap.has(email) || studentMap.get(email) === "Student") {
          studentMap.set(email, s.name || "Student");
        }
      }
    });

    if (studentMap.size === 0) return;

    // Check existing notifications for this job to prevent duplicate in-app or email notifications
    const existingNotifications = await Notification.find({
      jobId: job._id,
      type: "JOB_POSTED",
    }).select("recipientEmail emailSent").lean();

    const notifiedEmails = new Set(existingNotifications.map((n) => n.recipientEmail.toLowerCase().trim()));
    const emailAlreadySentEmails = new Set(
      existingNotifications.filter((n) => n.emailSent).map((n) => n.recipientEmail.toLowerCase().trim())
    );

    // 1. In-app notifications
    const newNotifications = [];
    for (const [email] of studentMap.entries()) {
      if (!notifiedEmails.has(email)) {
        newNotifications.push({
          recipientEmail: email,
          title: "🚀 New Placement Drive Posted",
          message: `${job.company} has posted a new drive: ${job.title} (${job.domain || "Placement Drive"})`,
          type: "JOB_POSTED",
          jobId: job._id,
          emailSent: false,
        });
      }
    }

    if (newNotifications.length > 0) {
      await Notification.insertMany(newNotifications).catch((err) =>
        console.error("Job broadcast notification insert error:", err.message)
      );
    }

    // 2. Email notifications via Promise.allSettled
    let frontendOrigin = "";
    if (req) {
      frontendOrigin = req.headers?.origin || req.headers?.referer || "";
      if (frontendOrigin.endsWith("/")) {
        frontendOrigin = frontendOrigin.slice(0, -1);
      }
    }

    const emailPromises = [];
    for (const [email, name] of studentMap.entries()) {
      if (!emailAlreadySentEmails.has(email)) {
        emailPromises.push(
          sendJobPostedEmail({
            recipientEmail: email,
            studentName: name,
            job,
            frontendBaseUrl: frontendOrigin,
          })
        );
      }
    }

    if (emailPromises.length > 0) {
      const results = await Promise.allSettled(emailPromises);
      const sentEmails = [];

      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value && r.value.success) {
          sentEmails.push(r.value.recipientEmail.toLowerCase().trim());
        }
      });

      if (sentEmails.length > 0) {
        await Notification.updateMany(
          { jobId: job._id, recipientEmail: { $in: sentEmails }, type: "JOB_POSTED" },
          { $set: { emailSent: true, emailSentAt: new Date() } }
        ).catch((err) => console.error("Failed to update emailSent flag:", err.message));
      }
    }
  } catch (err) {
    console.error("notifyStudentsNewJob error:", err.message);
  }
};

/**
 * Returns list of approved recruiter/admin emails dynamically from User model
 */
const getApprovedRecruiterEmails = async () => {
  const approvedUsers = await User.find({
    $or: [
      { role: "recruiter", verificationStatus: "approved" },
      { role: "admin" },
    ],
  }).select("email").lean();

  return approvedUsers
    .map((u) => (u.email ? u.email.toLowerCase().trim() : ""))
    .filter(Boolean);
};

/**
 * Constructs MongoDB query for student-facing job discovery
 * Enforces:
 * - Legitimate approved recruiter or admin
 * - Active status
 * - Non-expired deadline / expiryDate
 */
const getStudentVisibleJobQuery = async (additionalFilters = {}) => {
  const approvedRecruiterEmails = await getApprovedRecruiterEmails();
  const now = new Date();

  return {
    ...additionalFilters,
    status: { $in: ["Active", "active"] },
    recruiterEmail: { $in: approvedRecruiterEmails },
    $and: [
      { $or: [{ deadline: { $exists: false } }, { deadline: null }, { deadline: { $gte: now } }] },
      { $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gte: now } }] },
    ],
  };
};

// POST /api/jobs/jnf or POST /api/jobs - Recruiter JNF Drive Creation
const createJNF = async (req, res) => {
  try {
    if (req.user && req.user.role === "recruiter" && req.user.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: `Your recruiter account is currently '${req.user.verificationStatus}'. You cannot post jobs until approved by an administrator.`,
      });
    }

    const jobData = { ...req.body };

    // Enforce recruiter identity from authenticated session
    if (req.user) {
      jobData.postedBy = req.user.email || req.user.name || "Recruiter";
      jobData.recruiterEmail = req.user.email ? req.user.email.toLowerCase().trim() : jobData.recruiterEmail;
      if (req.user.company && !jobData.company) {
        jobData.company = req.user.company;
      }
    }

    if (!jobData.domain && jobData.title) {
      jobData.domain = getDomainForRole(jobData.title);
    }

    if (typeof jobData.requiredSkills === "string") {
      jobData.requiredSkills = jobData.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof jobData.eligibleBranches === "string") {
      jobData.eligibleBranches = jobData.eligibleBranches.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const newJob = await Job.create(jobData);

    // Notify students via in-app & email asynchronously
    notifyStudentsNewJob(newJob, req);

    return res.status(201).json({
      success: true,
      message: "Job posted and students notified successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Create JNF Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error creating job posting",
    });
  }
};

// GET /api/jobs/my-applications - Scoped to logged-in student
const getMyApplications = async (req, res) => {
  try {
    const studentEmail = (req.user?.email || req.query.email || "").toLowerCase().trim();

    if (!studentEmail) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view applications.",
      });
    }

    const apps = await Application.find({ applicantEmail: studentEmail }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications: apps,
      data: apps,
    });
  } catch (error) {
    console.error("Error fetching student applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve student applications",
    });
  }
};

// GET /api/jobs - List legitimate active & non-expired jobs with multi-domain query filters
const getJobs = async (req, res) => {
  try {
    const { search, domain, role, location, jobType, workMode, sort, career } = req.query;

    let additionalFilter = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      additionalFilter.$or = [
        { title: regex },
        { company: regex },
        { domain: regex },
        { requiredSkills: regex },
        { description: regex },
        { location: regex },
      ];
    }

    if (domain && domain !== "all" && domain !== "All Domains") {
      additionalFilter.domain = new RegExp(domain.trim(), "i");
    }

    const targetRole = role || career;
    if (targetRole && targetRole !== "all" && targetRole !== "All Roles") {
      additionalFilter.title = new RegExp(targetRole.trim(), "i");
    }

    if (location && location !== "all" && location !== "All Locations") {
      additionalFilter.location = new RegExp(location.trim(), "i");
    }

    if (jobType && jobType !== "all") {
      additionalFilter.jobType = new RegExp(jobType.trim(), "i");
    }

    if (workMode && workMode !== "all") {
      additionalFilter.workMode = new RegExp(workMode.trim(), "i");
    }

    const studentFilter = await getStudentVisibleJobQuery(additionalFilter);
    const jobs = await Job.find(studentFilter).sort({ createdAt: -1 }).lean();

    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } }).select("jobId").lean();

    let jobsWithDetails = await Promise.all(
      jobs.map(async (job) => {
        const count = applications.filter((a) => String(a.jobId) === String(job._id)).length;
        let matchDetails = null;

        if (req.user) {
          try {
            matchDetails = await calculateJobMatch(req.user, job);
          } catch (err) {
            matchDetails = null;
          }
        }

        return {
          ...job,
          applicantCount: count,
          matchScore: matchDetails?.matchScore || null,
          matchedSkills: matchDetails?.matchedSkills || [],
          missingSkills: matchDetails?.missingSkills || [],
          eligibility: matchDetails?.eligibility || "ELIGIBLE",
        };
      })
    );

    if (sort === "matchScore" && req.user) {
      jobsWithDetails.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return res.status(200).json({
      success: true,
      count: jobsWithDetails.length,
      jobs: jobsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ success: false, message: "Error fetching jobs" });
  }
};

// GET /api/jobs/recommendations - Legacy alias for job recommendations preserving career filter
const getJobRecommendations = async (req, res) => {
  try {
    const { career } = req.query;

    let filter = {};
    if (career && career.trim()) {
      filter.title = new RegExp(career.trim(), "i");
    }

    const studentFilter = await getStudentVisibleJobQuery(filter);
    const jobs = await Job.find(studentFilter).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return res.status(500).json({ success: false, message: "Error fetching recommendations" });
  }
};

// POST /api/jobs/apply - 1-Click Apply
const applyJob = async (req, res) => {
  try {
    const {
      jobId,
      applicantName,
      applicantEmail,
      applicantCgpa,
      education,
      matchedCareer,
      careerScore,
      skills,
      companyName,
      jobTitle,
    } = req.body;

    const studentEmail = (req.user?.email || applicantEmail || "").toLowerCase().trim();
    const studentName = req.user?.name || applicantName || "Student Applicant";
    const studentId = req.user?._id || req.user?.id;

    if (!studentEmail) {
      return res.status(400).json({
        success: false,
        message: "Applicant email is required.",
      });
    }

    let targetJob = null;
    if (jobId) {
      targetJob = await Job.findById(jobId);
    }

    const job_title = targetJob?.title || jobTitle || "Career Position";
    const company_name = targetJob?.company || companyName || "Partner Company";
    const recruiter_email = targetJob?.recruiterEmail || (targetJob?.postedBy?.includes("@") ? targetJob.postedBy : "");

    // Prevent duplicate application
    if (jobId) {
      const existing = await Application.findOne({
        jobId,
        applicantEmail: studentEmail,
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `You have already submitted an application for ${job_title} at ${company_name}.`,
          application: existing,
        });
      }
    }

    let computedScore = Number(careerScore);
    if (!computedScore || isNaN(computedScore)) {
      if (targetJob && req.user) {
        const matchRes = await calculateJobMatch(req.user, targetJob);
        computedScore = matchRes.matchScore;
      } else {
        computedScore = 75;
      }
    }

    const newApp = await Application.create({
      jobId: targetJob?._id || jobId || null,
      jobTitle: job_title,
      companyName: company_name,
      recruiterEmail: recruiter_email ? recruiter_email.toLowerCase().trim() : "",
      applicantId: studentId || null,
      applicantName: studentName,
      applicantEmail: studentEmail,
      education: education || "Undergraduate / Graduate",
      skills: Array.isArray(skills) ? skills : (skills || "").split(",").map((s) => s.trim()).filter(Boolean),
      matchedCareer: matchedCareer || targetJob?.title || "General Role",
      careerScore: computedScore,
      status: "Applied",
    });

    if (recruiter_email) {
      await Notification.create({
        recipientEmail: recruiter_email.toLowerCase().trim(),
        title: "📥 New Candidate Application",
        message: `${studentName} has submitted an application for ${job_title}.`,
        type: "APPLICATION",
        jobId: targetJob?._id || null,
        applicationId: newApp._id,
      }).catch((err) => console.error("Recruiter notification error:", err.message));
    }

    await Notification.create({
      recipientEmail: studentEmail,
      title: "✅ Application Submitted",
      message: `Your application for ${job_title} at ${company_name} was received successfully.`,
      type: "APPLICATION",
      jobId: targetJob?._id || null,
      applicationId: newApp._id,
    }).catch((err) => console.error("Student notification error:", err.message));

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application: newApp,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting application",
      error: error.message,
    });
  }
};

// GET /api/jobs/recommended - Canonical API for Student AI Recommendations
const getRecommendedJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required for personalized recommendations.",
      });
    }

    const recommendations = await getRecommendedJobsForStudent(req.user);

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
      jobs: recommendations.map((r) => ({
        ...r.job,
        matchScore: r.matchScore,
        matchedSkills: r.matchedSkills,
        missingSkills: r.missingSkills,
        eligibility: r.eligibility,
        explanation: r.explanation,
        learningRecommendation: r.learningRecommendation,
      })),
    });
  } catch (error) {
    console.error("Get Recommended Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate personalized job recommendations.",
      error: error.message,
    });
  }
};

// GET /api/jobs/:id/match - Dynamic Match calculation for specific job detail page with Student Visibility Check
const getJobMatchDetails = async (req, res) => {
  try {
    const { id } = req.params;

    let job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job drive not found.",
      });
    }

    // If caller is student or unauthenticated, verify job passes student visibility rules
    if (!req.user || req.user.role === "student") {
      const studentFilter = await getStudentVisibleJobQuery({ _id: job._id });
      const isVisible = await Job.exists(studentFilter);
      if (!isVisible) {
        return res.status(404).json({
          success: false,
          message: "Job drive not found or no longer active.",
        });
      }
    }

    if (!req.user) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        match: null,
        job,
      });
    }

    const matchDetails = await calculateJobMatch(req.user, job);

    return res.status(200).json({
      success: true,
      authenticated: true,
      match: matchDetails,
      job,
    });
  } catch (error) {
    console.error("Get Job Match Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate job match details.",
      error: error.message,
    });
  }
};

module.exports = {
  createJNF,
  getMyApplications,
  getJobs,
  getJobRecommendations,
  applyJob,
  getRecommendedJobs,
  getJobMatchDetails,
  getApprovedRecruiterEmails,
  getStudentVisibleJobQuery,
  notifyStudentsNewJob,
};