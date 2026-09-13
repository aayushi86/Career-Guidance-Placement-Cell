const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");

// POST /api/applications - Student 1-Click Apply
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

    const studentEmail = (req.user?.email ? req.user.email : (applicantEmail || "")).toLowerCase().trim();
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
      if (targetJob && targetJob.status === "closed") {
        return res.status(400).json({
          success: false,
          message: `Application drive for "${targetJob.title}" at ${targetJob.company} is currently closed.`,
        });
      }
    }

    const resolvedJobTitle = targetJob?.title || jobTitle || "General Placement Role";
    const resolvedCompany = targetJob?.company || companyName || "Partner Company";
    const resolvedRecruiter = targetJob?.recruiterEmail || (targetJob?.postedBy?.includes("@") ? targetJob.postedBy : "");

    // Prevent duplicate application if already submitted
    if (jobId) {
      const existing = await Application.findOne({
        jobId,
        applicantEmail: studentEmail,
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          alreadyApplied: true,
          message: `You have already applied for ${resolvedJobTitle} at ${resolvedCompany}.`,
          application: existing,
        });
      }
    }

    const newApp = await Application.create({
      jobId: targetJob?._id || jobId || null,
      jobTitle: resolvedJobTitle,
      companyName: resolvedCompany,
      recruiterEmail: resolvedRecruiter ? resolvedRecruiter.toLowerCase().trim() : "",
      applicantId: studentId || null,
      applicantName: studentName,
      applicantEmail: studentEmail,
      education: education || "Undergraduate / Graduate",
      skills: Array.isArray(skills) ? skills : (skills || "").split(",").map((s) => s.trim()).filter(Boolean),
      matchedCareer: matchedCareer || resolvedJobTitle,
      careerScore: Number(careerScore) || 75,
      status: "Applied",
    });

    // Notify Recruiter
    if (resolvedRecruiter) {
      await Notification.create({
        recipientEmail: resolvedRecruiter.toLowerCase().trim(),
        title: "📥 New Candidate Application",
        message: `${studentName} has submitted an application for ${resolvedJobTitle}.`,
        type: "APPLICATION",
        jobId: targetJob?._id || null,
        applicationId: newApp._id,
      }).catch((err) => console.error("Recruiter notification error:", err.message));
    }

    // Notify Student
    await Notification.create({
      recipientEmail: studentEmail,
      title: "✅ Application Submitted",
      message: `Your application for ${resolvedJobTitle} at ${resolvedCompany} was submitted successfully.`,
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
    console.error("Application error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting application",
      error: error.message,
    });
  }
};

// GET /api/applications/my-applications
const getMyApplications = async (req, res) => {
  try {
    const studentEmail = (req.user?.email ? req.user.email : (req.query.email || "")).toLowerCase().trim();

    if (!studentEmail) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to retrieve applications.",
      });
    }

    const applications = await Application.find({
      applicantEmail: studentEmail,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student applications",
    });
  }
};

// GET /api/applications/user/:email or /student/:email
const getUserApplications = async (req, res) => {
  try {
    const requestedEmail = (req.params.email || "").toLowerCase().trim();
    const userEmail = (req.user?.email || "").toLowerCase().trim();

    // Security: Student cannot read another student's applications
    if (req.user?.role !== "admin" && userEmail !== requestedEmail) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to view another user's applications.",
      });
    }

    const applications = await Application.find({
      applicantEmail: requestedEmail,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      applications,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user applications",
    });
  }
};

// GET /api/applications - Admin view all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all applications",
    });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getUserApplications,
  getAllApplications,
};