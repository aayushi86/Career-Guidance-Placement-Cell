const Job = require("../models/Job");
const { notifyStudentsNewJob } = require("./jobController");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Student = require("../models/Student");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { getDomainForRole, getRoleSkillRequirements } = require("../config/careerDomains");

// Helper to get all job IDs legitimately owned by the authenticated recruiter
const getRecruiterJobIds = async (user) => {
  const email = (user?.email || "").toLowerCase().trim();
  const id = user?.id || user?._id;

  if (!email) return [];

  const queryConditions = [
    { recruiterEmail: email },
    { postedBy: email },
  ];

  if (id) {
    queryConditions.push({ postedBy: String(id) });
  }

  // Legacy seed fallback ONLY applies if the logged-in user is explicitly "recruiter@company.com"
  if (email === "recruiter@company.com") {
    queryConditions.push({ recruiterEmail: "recruiter@company.com" });
    queryConditions.push({ postedBy: "Recruiter" });
  }

  const jobs = await Job.find({ $or: queryConditions }).select("_id");
  return jobs.map((j) => j._id);
};

// GET /api/recruiter/dashboard - Aggregated stats across ALL jobs owned by this recruiter
const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterEmail = (req.user?.email || "").toLowerCase().trim();

    if (!recruiterEmail) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const myJobIds = await getRecruiterJobIds(req.user);
    const jobs = await Job.find({ _id: { $in: myJobIds } }).sort({ createdAt: -1 }).lean();

    const applications = await Application.find({
      $or: [
        { recruiterEmail },
        { jobId: { $in: myJobIds } },
      ],
    }).sort({ createdAt: -1 }).lean();

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status !== "Closed" && j.status !== "closed").length;
    const closedJobs = jobs.filter((j) => j.status === "Closed" || j.status === "closed").length;

    const totalApplicants = applications.length;
    const appliedCount = applications.filter((a) => !a.status || a.status === "Applied").length;
    const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
    const interviewCount = applications.filter((a) => a.status === "Interview Scheduled").length;
    const selectedCount = applications.filter((a) => a.status === "Selected" || a.status === "Offer Extended").length;
    const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

    return res.status(200).json({
      success: true,
      verificationStatus: req.user.verificationStatus || "approved",
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplicants,
        appliedCount,
        shortlistedCount,
        interviewCount,
        selectedCount,
        rejectedCount,
      },
      jobs,
      recentApplications: applications,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ success: false, message: "Error fetching recruiter dashboard" });
  }
};

// GET /api/recruiter/jobs - All jobs legitimately owned by the authenticated recruiter with per-job stats
const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterEmail = (req.user?.email || "").toLowerCase().trim();

    if (!recruiterEmail) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const myJobIds = await getRecruiterJobIds(req.user);
    const jobs = await Job.find({ _id: { $in: myJobIds } }).sort({ createdAt: -1 }).lean();

    const applications = await Application.find({
      $or: [
        { recruiterEmail },
        { jobId: { $in: myJobIds } },
      ],
    }).lean();

    const jobsWithStats = jobs.map((job) => {
      const jobApps = applications.filter(
        (a) => String(a.jobId) === String(job._id) || (a.jobTitle === job.title && a.companyName === job.company)
      );

      return {
        ...job,
        totalApplications: jobApps.length,
        shortlistedCount: jobApps.filter((a) => a.status === "Shortlisted").length,
        interviewCount: jobApps.filter((a) => a.status === "Interview Scheduled").length,
        offersCount: jobApps.filter((a) => a.status === "Selected" || a.status === "Offer Extended").length,
        rejectedCount: jobApps.filter((a) => a.status === "Rejected").length,
      };
    });

    return res.status(200).json({
      success: true,
      count: jobsWithStats.length,
      jobs: jobsWithStats,
    });
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch recruiter jobs." });
  }
};

// GET /api/recruiter/applications?jobId=...
const getApplications = async (req, res) => {
  try {
    const recruiterEmail = (req.user?.email || "").toLowerCase().trim();

    if (!recruiterEmail) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const myJobIds = await getRecruiterJobIds(req.user);
    const { jobId } = req.query;

    let filter = {
      $or: [
        { recruiterEmail },
        { jobId: { $in: myJobIds } },
      ],
    };

    // If specific jobId is provided in query, filter by it after verifying ownership
    if (jobId && jobId !== "all") {
      const targetJobId = String(jobId);
      const isOwned = myJobIds.some((id) => String(id) === targetJobId);
      if (isOwned || req.user.role === "admin") {
        filter = {
          jobId: targetJobId,
        };
      } else {
        // Forbidden: Recruiter does not own this job
        return res.status(200).json({
          success: true,
          count: 0,
          applications: [],
          data: [],
        });
      }
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 }).lean();

    // Fetch real ATS scores for applicant emails
    const applicantEmails = Array.from(
      new Set(applications.map((a) => (a.applicantEmail || "").toLowerCase().trim()).filter(Boolean))
    );

    const resumeAnalyses = await ResumeAnalysis.find({
      userEmail: { $in: applicantEmails },
    }).lean();

    const enrichedApps = applications.map((app) => {
      const email = (app.applicantEmail || "").toLowerCase().trim();
      const resume = resumeAnalyses.find((r) => r.userEmail?.toLowerCase().trim() === email);

      return {
        ...app,
        atsScore: typeof resume?.atsScore === "number" ? `${resume.atsScore}%` : "Not available",
        careerMatch: app.matchedCareer ? `${app.matchedCareer}` : "Not available",
        matchScore: typeof app.careerScore === "number" ? `${app.careerScore}%` : "Not available",
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedApps.length,
      applications: enrichedApps,
      data: enrichedApps,
    });
  } catch (err) {
    console.error("Recruiter applications fetch error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch applications.",
    });
  }
};

// POST /api/recruiter/jobs
const postJob = async (req, res) => {
  try {
    if (req.user.verificationStatus !== "approved" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: `Your recruiter account is currently '${req.user.verificationStatus || "pending"}'. You cannot post jobs until approved by an administrator.`,
      });
    }

    const {
      title,
      company,
      domain: inputDomain,
      careerRole: inputRole,
      description,
      location,
      salary,
      ctcPackage,
      baseSalary,
      joiningBonus,
      minAssessmentScore,
      minCgpa,
      eligibleBranches,
      jobType,
      targetCareer,
      requiredSkills,
      skillsRequired,
      selectionProcess,
      deadline,
    } = req.body;

    if (!title || (!company && !req.user.company)) {
      return res.status(400).json({
        success: false,
        message: "Job title and company name are required.",
      });
    }

    const jobRole = inputRole || targetCareer || title.trim();
    const jobDomain = inputDomain || getDomainForRole(jobRole) || "General";

    const cleanSkills = requiredSkills || skillsRequired;
    let skillsList = Array.isArray(cleanSkills)
      ? cleanSkills
      : typeof cleanSkills === "string" && cleanSkills.trim()
      ? cleanSkills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (skillsList.length === 0) {
      const roleReqs = getRoleSkillRequirements(jobRole);
      skillsList = [...(roleReqs.coreSkills || []), ...(roleReqs.technicalSkills || [])];
    }

    const branches = Array.isArray(eligibleBranches)
      ? eligibleBranches
      : typeof eligibleBranches === "string" && eligibleBranches.trim()
      ? eligibleBranches.split(",").map((b) => b.trim()).filter(Boolean)
      : ["Any Discipline"];

    const newJob = await Job.create({
      title: title.trim(),
      company: (company || req.user.company || "Corporate Partner").trim(),
      domain: jobDomain,
      careerRole: jobRole,
      description: description || "Seeking qualified candidates for campus placement.",
      location: location || "Mumbai / Hybrid",
      jobType: jobType || "Full-time",
      ctcPackage: ctcPackage || salary || "6-10 LPA",
      baseSalary: baseSalary || "5.5 LPA",
      joiningBonus: joiningBonus || "1 LPA",
      minAssessmentScore: Number(minAssessmentScore) || 75,
      minCgpa: Number(minCgpa) || 6.5,
      eligibleBranches: branches,
      requiredSkills: skillsList,
      selectionProcess: selectionProcess || ["Skill Assessment", "Technical Interview", "HR Discussion"],
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      postedBy: req.user.email,
      recruiterEmail: req.user.email.toLowerCase().trim(),
      status: "Active",
    });

    // Notify students of the new job posting via in-app & email
    notifyStudentsNewJob(newJob, req);

    return res.status(201).json({
      success: true,
      message: "Job drive posted successfully!",
      job: newJob,
    });
  } catch (error) {
    console.error("Post job error:", error);
    return res.status(500).json({ success: false, message: error.message || "Error creating job posting" });
  }
};

// PUT or PATCH /api/recruiter/applications/:id
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interviewDate, interviewTime, interviewLink, interviewNotes } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Application ID is required." });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application record not found." });
    }

    const recruiterEmail = (req.user.email || "").toLowerCase().trim();
    const myJobIds = await getRecruiterJobIds(req.user);
    const ownsJob = (application.recruiterEmail && application.recruiterEmail.toLowerCase().trim() === recruiterEmail) ||
      (application.jobId && myJobIds.some((jId) => String(jId) === String(application.jobId))) ||
      req.user.role === "admin";

    if (!ownsJob) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are only allowed to manage applications for your own job postings.",
      });
    }

    const previousStatus = application.status;
    if (status) application.status = status;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;
    if (interviewTime !== undefined) application.interviewTime = interviewTime;
    if (interviewLink !== undefined) application.interviewLink = interviewLink;
    if (interviewNotes !== undefined) application.interviewNotes = interviewNotes;

    await application.save();

    // Trigger notification to student if status changed or interview scheduled
    if (application.applicantEmail && (previousStatus !== status || status === "Interview Scheduled")) {
      const recipientEmail = application.applicantEmail.toLowerCase().trim();
      let notifType = "APPLICATION";
      let title = `Application Update: ${application.jobTitle}`;
      let message = `Your application for ${application.jobTitle} at ${application.companyName} is now: ${application.status}.`;

      if (application.status === "Shortlisted") {
        notifType = "SHORTLISTED";
        title = `🌟 Shortlisted: ${application.jobTitle}`;
        message = `Congratulations! You have been shortlisted by ${application.companyName} for the ${application.jobTitle} position.`;
      } else if (application.status === "Interview Scheduled") {
        notifType = "INTERVIEW";
        title = `🎯 Interview Scheduled: ${application.jobTitle}`;
        message = `Your interview with ${application.companyName} is scheduled on ${interviewDate || "TBD"} at ${interviewTime || "TBD"}. ${interviewLink ? `Meeting Link: ${interviewLink}` : ""}`;
      } else if (application.status === "Offer Extended" || application.status === "Selected") {
        notifType = "OFFER";
        title = `🎉 Placement Offer: ${application.companyName}`;
        message = `Congratulations! ${application.companyName} has selected you for the ${application.jobTitle} position!`;
      } else if (application.status === "Rejected") {
        notifType = "REJECTED";
        title = `Application Status: ${application.jobTitle}`;
        message = `Thank you for your interest in ${application.companyName}. Your application for ${application.jobTitle} was not moved forward at this time.`;
      }

      await Notification.create({
        recipientEmail,
        title,
        message,
        type: notifType,
        jobId: application.jobId || null,
        applicationId: application._id,
      }).catch((err) => console.error("Notification creation skipped:", err.message));
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to ${application.status}`,
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to update status" });
  }
};

// PATCH /api/recruiter/profile
const updateCompanyProfile = async (req, res) => {
  try {
    const { name, company, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      {
        $set: {
          ...(name ? { name: name.trim() } : {}),
          ...(company ? { company: company.trim() } : {}),
          ...(phone ? { phone: phone.trim() } : {}),
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update company profile." });
  }
};

// PUT /api/recruiter/jobs/:id
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job drive not found." });
    }

    const myJobIds = await getRecruiterJobIds(req.user);
    const isOwned = myJobIds.some((jId) => String(jId) === String(id)) || req.user.role === "admin";

    if (!isOwned) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this job drive." });
    }

    const {
      title,
      company,
      description,
      location,
      ctcPackage,
      minAssessmentScore,
      minCgpa,
      requiredSkills,
      status,
    } = req.body;

    if (title) job.title = title.trim();
    if (company) job.company = company.trim();
    if (description) job.description = description;
    if (location) job.location = location;
    if (ctcPackage) job.ctcPackage = ctcPackage;
    if (minAssessmentScore !== undefined) job.minAssessmentScore = Number(minAssessmentScore);
    if (minCgpa !== undefined) job.minCgpa = Number(minCgpa);
    if (status) job.status = status;

    if (requiredSkills) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job drive updated successfully.",
      job,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update job drive." });
  }
};

// PATCH /api/recruiter/jobs/:id/close
const closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job drive not found." });
    }

    const myJobIds = await getRecruiterJobIds(req.user);
    const isOwned = myJobIds.some((jId) => String(jId) === String(id)) || req.user.role === "admin";

    if (!isOwned) {
      return res.status(403).json({ success: false, message: "Forbidden: You do not own this job drive." });
    }

    job.status = job.status === "closed" ? "Active" : "closed";
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job drive ${job.status === "closed" ? "closed" : "reopened"} successfully.`,
      job,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update job drive status." });
  }
};

module.exports = {
  getRecruiterDashboard,
  getRecruiterJobs,
  getApplications,
  postJob,
  updateApplicationStatus,
  updateCompanyProfile,
  updateJob,
  closeJob,
};