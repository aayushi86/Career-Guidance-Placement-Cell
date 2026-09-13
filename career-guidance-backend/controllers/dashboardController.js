const ResumeAnalysis = require("../models/ResumeAnalysis");
const CareerRoadmap = require("../models/CareerRoadmap");
const Application = require("../models/Application");

// ==========================================
// GET STUDENT CAREER PROGRESS DASHBOARD
// GET /api/dashboard/progress
// ==========================================
const getCareerProgress = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email ? req.user.email.toLowerCase().trim() : null;

    // 1. RESUME ANALYSIS METRICS
    const resumeAnalyses = await ResumeAnalysis.find({ userId }).sort({ createdAt: -1 });
    const latestAnalysis = resumeAnalyses[0] || null;
    const latestATSScore = latestAnalysis ? latestAnalysis.atsScore || 0 : 0;
    const bestATSScore =
      resumeAnalyses.length > 0
        ? Math.max(...resumeAnalyses.map((a) => a.atsScore || 0))
        : 0;

    // 2. CAREER ROADMAP METRICS
    const roadmap = await CareerRoadmap.findOne({ userId, status: "active" }).sort({ createdAt: -1 })
      || await CareerRoadmap.findOne({ userId }).sort({ createdAt: -1 });

    const roadmapProgress = roadmap?.progress?.overallProgress || 0;
    const readinessScore = roadmap?.readinessScore || 0;

    // 3. LIVE APPLICATION FUNNEL
    const query = {
      $or: [
        { studentId: userId },
        { applicantId: userId },
        { userId: userId },
        ...(userEmail ? [{ applicantEmail: userEmail }] : []),
      ],
    };

    const studentApplications = await Application.find(query);

    const applications = {
      total: studentApplications.length,
      applied: 0,
      shortlisted: 0,
      interviewScheduled: 0,
      offerExtended: 0,
      rejected: 0,
    };

    studentApplications.forEach((app) => {
      const status = app.status;
      if (status === "Applied") applications.applied += 1;
      else if (status === "Shortlisted") applications.shortlisted += 1;
      else if (status === "Interview Scheduled") applications.interviewScheduled += 1;
      else if (status === "Offer Extended" || status === "Selected") applications.offerExtended += 1;
      else if (status === "Rejected") applications.rejected += 1;
    });

    // 4. OVERALL EMPLOYABILITY SCORE (Weighted Formula)
    const overallEmployabilityScore = Math.round(
      latestATSScore * 0.4 + readinessScore * 0.3 + roadmapProgress * 0.3
    );

    res.status(200).json({
      success: true,
      data: {
        resume: {
          latestATSScore,
          bestATSScore,
          totalAnalyses: resumeAnalyses.length,
        },
        roadmap: {
          progress: roadmapProgress,
          readinessScore,
          targetRole: roadmap?.targetRole || "Not selected",
          completedTasksCount: roadmap?.progress?.completedTasks?.length || 0,
        },
        applications,
        overallEmployabilityScore,
      },
    });
  } catch (error) {
    console.error("Career dashboard error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to load career progress dashboard.",
      error: error.message,
    });
  }
};

module.exports = {
  getCareerProgress,
};