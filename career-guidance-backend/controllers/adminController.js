const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Notification = require("../models/Notification");

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const pendingRecruiters = await User.countDocuments({
      role: "recruiter",
      verificationStatus: "pending",
    });
    const approvedRecruiters = await User.countDocuments({
      role: "recruiter",
      verificationStatus: "approved",
    });
    const rejectedRecruiters = await User.countDocuments({
      role: "recruiter",
      verificationStatus: "rejected",
    });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: { $ne: "closed" } });
    const closedJobs = await Job.countDocuments({ status: "closed" });

    const applications = await Application.find().sort({ createdAt: -1 });

    const applied = applications.filter((a) => !a.status || a.status === "Applied").length;
    const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
    const interviewScheduled = applications.filter(
      (a) => a.status === "Interview Scheduled" || a.status === "Interview"
    ).length;
    const selected = applications.filter((a) => a.status === "Selected").length;
    const offers = applications.filter((a) => a.status === "Offer Extended" || a.status === "Offer").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;

    const placedCount = selected + offers;
    const placementRate =
      totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        pendingRecruiters,
        approvedRecruiters,
        rejectedRecruiters,
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications: applications.length,
        applied,
        shortlisted,
        interviewScheduled,
        selected,
        offers,
        rejected,
        placementRate,
      },
      recentActivity: applications,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ success: false, message: "Error fetching admin stats" });
  }
};

// GET /api/admin/recruiters
const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: recruiters.length,
      recruiters,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch recruiters" });
  }
};

// PATCH /api/admin/recruiters/:id/verify
const verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "rejected" | "pending"

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'approved', 'rejected', or 'pending'.",
      });
    }

    const recruiter = await User.findByIdAndUpdate(
      id,
      { $set: { verificationStatus: status } },
      { new: true }
    ).select("-password");

    if (!recruiter) {
      return res.status(404).json({ success: false, message: "Recruiter account not found." });
    }

    // Send verification update notification to recruiter
    await Notification.create({
      recipientEmail: recruiter.email.toLowerCase().trim(),
      title: `Recruiter Account ${status.toUpperCase()}`,
      message:
        status === "approved"
          ? "🎉 Congratulations! Your recruiter profile has been approved by the Placement Cell Admin. You can now post campus placement drives."
          : status === "rejected"
          ? "⚠️ Your recruiter verification request was not approved by the Placement Cell Admin. Please contact placement support."
          : "⏳ Your recruiter account verification status is under review.",
      type: "GENERAL",
    }).catch((err) => console.error("Notification creation error:", err));

    return res.status(200).json({
      success: true,
      message: `Recruiter account marked as ${status}.`,
      recruiter,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update recruiter status" });
  }
};

// GET /api/admin/students
const getStudents = async (req, res) => {
  try {
    const studentUsers = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const studentProfiles = await Student.find().lean();
    const applications = await Application.find().lean();

    const students = studentUsers.map((user) => {
      const profile = studentProfiles.find(
        (p) => p.email?.toLowerCase() === user.email?.toLowerCase()
      );

      const userApps = applications.filter(
        (a) => a.applicantEmail?.toLowerCase() === user.email?.toLowerCase()
      );

      const latestStatus = userApps[0]?.status || "Not Applied";
      const isPlaced = userApps.some(
        (a) => a.status === "Selected" || a.status === "Offer Extended"
      );

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || profile?.phone || "N/A",
        education: profile?.education || profile?.degree || "Undergraduate",
        skills: profile?.skills || user.skills || [],
        targetRole: profile?.targetRole || profile?.preferredRole || "General Career Profile",
        readinessScore: profile?.careerScore || profile?.readinessScore || 75,
        applicationCount: userApps.length,
        placementStatus: isPlaced ? "Placed" : latestStatus,
        createdAt: user.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Admin getStudents error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
};

// DELETE /api/admin/students/:id
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.role !== "student") {
      return res.status(404).json({ success: false, message: "Student record not found." });
    }

    await User.findByIdAndDelete(id);
    await Student.deleteMany({ email: user.email.toLowerCase() });

    return res.status(200).json({
      success: true,
      message: `Student ${user.email} successfully removed.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete student record." });
  }
};

// GET /api/admin/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

// PATCH /api/admin/jobs/:id/status
const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "active" | "closed"

    const job = await Job.findByIdAndUpdate(
      id,
      { $set: { status: status || "closed" } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job drive not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Job drive ${job.title} status updated to ${job.status}.`,
      job,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update job status" });
  }
};

// DELETE /api/admin/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Job drive "${job.title}" removed successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete job drive." });
  }
};

// GET /api/admin/applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const applications = await Application.find().lean();
    const jobs = await Job.find().lean();
    const recruiters = await User.find({ role: "recruiter" }).select("-password").lean();
    const students = await User.find({ role: "student" }).select("-password").lean();

    // Application Status Breakdown
    const statusMap = {};
    applications.forEach((a) => {
      const st = a.status || "Applied";
      statusMap[st] = (statusMap[st] || 0) + 1;
    });

    // Company Application Counts
    const companyAppsMap = {};
    applications.forEach((a) => {
      const comp = a.companyName || a.company || "Unknown Company";
      companyAppsMap[comp] = (companyAppsMap[comp] || 0) + 1;
    });

    // Jobs per Company
    const companyJobsMap = {};
    jobs.forEach((j) => {
      const comp = j.company || "Unknown Company";
      companyJobsMap[comp] = (companyJobsMap[comp] || 0) + 1;
    });

    // Recruiter Status Breakdown
    const recruiterStatusMap = {
      approved: recruiters.filter((r) => r.verificationStatus === "approved").length,
      pending: recruiters.filter((r) => r.verificationStatus === "pending").length,
      rejected: recruiters.filter((r) => r.verificationStatus === "rejected").length,
    };

    // AI Placement Intelligence: Demanded Skills across Jobs
    const demandedSkillsMap = {};
    jobs.forEach((j) => {
      if (Array.isArray(j.requiredSkills)) {
        j.requiredSkills.forEach((s) => {
          const norm = String(s).trim();
          if (norm) demandedSkillsMap[norm] = (demandedSkillsMap[norm] || 0) + 1;
        });
      }
    });

    // Career Roles Distribution across Applicants & Students
    const careerRolesMap = {};
    applications.forEach((a) => {
      const role = a.matchedCareer || a.jobTitle || "General Placement Role";
      careerRolesMap[role] = (careerRolesMap[role] || 0) + 1;
    });

    // Average Job Match Score
    const totalMatchScores = applications.reduce((acc, a) => acc + (a.careerScore || 75), 0);
    const averageMatchScore = applications.length > 0 ? Math.round(totalMatchScores / applications.length) : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        statusBreakdown: statusMap,
        companyApplications: companyAppsMap,
        companyJobs: companyJobsMap,
        recruiterStatus: recruiterStatusMap,
        demandedSkills: demandedSkillsMap,
        careerRolesDistribution: careerRolesMap,
        averageMatchScore,
        totalStudents: students.length,
        totalRecruiters: recruiters.length,
        totalJobs: jobs.length,
        totalApplications: applications.length,
      },
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate analytics" });
  }
};

// POST /api/admin/announcements
const sendAnnouncement = async (req, res) => {
  try {
    const { targetGroup, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required for announcements.",
      });
    }

    let filter = {};
    if (targetGroup === "students") filter = { role: "student" };
    else if (targetGroup === "recruiters") filter = { role: "recruiter" };

    const targetUsers = await User.find(filter).select("email").lean();

    if (targetUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No recipient users found for the selected target group.",
      });
    }

    const notificationsToInsert = targetUsers.map((u) => ({
      recipientEmail: u.email.toLowerCase().trim(),
      title: `📢 ${title}`,
      message,
      type: "GENERAL",
      isRead: false,
    }));

    await Notification.insertMany(notificationsToInsert);

    return res.status(200).json({
      success: true,
      message: `Announcement broadcast successfully to ${targetUsers.length} user(s).`,
      recipientCount: targetUsers.length,
    });
  } catch (error) {
    console.error("Announcement error:", error);
    return res.status(500).json({ success: false, message: "Failed to broadcast announcement." });
  }
};

module.exports = {
  getAdminStats,
  getRecruiters,
  verifyRecruiter,
  getStudents,
  deleteStudent,
  getJobs,
  toggleJobStatus,
  deleteJob,
  getApplications,
  getAnalytics,
  sendAnnouncement,
};