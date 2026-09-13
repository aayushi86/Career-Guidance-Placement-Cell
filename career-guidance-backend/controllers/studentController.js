const Student = require("../models/Student");
const User = require("../models/User");
const CareerTest = require("../models/CareerTest");
const Application = require("../models/Application");

// GET /api/students/profile or /api/students/dashboard
const getStudentProfile = async (req, res) => {
  try {
    const userEmail = (req.user?.email || "").toLowerCase().trim();

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view student profile.",
      });
    }

    const [student, user, tests, applications] = await Promise.all([
      Student.findOne({ email: userEmail }),
      User.findOne({ email: userEmail }),
      CareerTest.find({ email: userEmail }).sort({ createdAt: -1 }),
      Application.find({ applicantEmail: userEmail }).sort({ createdAt: -1 }),
    ]);

    const latestTest = tests[0] || null;
    const currentEducation = student?.education || student?.degree || "";

    const profileData = {
      name: student?.name || user?.name || "Student",
      email: userEmail,
      skills: student?.skills || [],
      degree: currentEducation,
      education: currentEducation,
      college: student?.college || "",
      interests: student?.interests || (latestTest?.interests || []),
      preferredWorkStyle: student?.preferredWorkStyle || (latestTest?.preferredWorkStyle || "Analytical"),
      targetRole: student?.targetRole || latestTest?.topRecommendation || "",
      readinessScore: student?.readinessScore || (latestTest ? latestTest.score : 0),
      careerTestDone: Boolean(latestTest),
      totalApplications: applications.length,
      latestTest,
      recentApplications: applications.slice(0, 5),
      shortlistedCount: applications.filter((app) => app.status === "Shortlisted").length,
      interviewCount: applications.filter((app) => app.status === "Interview Scheduled").length,
      selectedCount: applications.filter((app) => app.status === "Selected" || app.status === "Offer Extended").length,
    };

    return res.status(200).json({
      success: true,
      profile: profileData,
    });
  } catch (error) {
    console.error("Dashboard profile fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load student profile.",
    });
  }
};

// PUT /api/students/profile
const updateStudentProfile = async (req, res) => {
  try {
    const userEmail = (req.user?.email || "").toLowerCase().trim();

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to update profile.",
      });
    }

    const {
      name,
      skills,
      education,
      degree,
      college,
      targetRole,
      interests,
      preferredWorkStyle,
    } = req.body;

    const eduValue = education || degree || "";
    const cleanSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const cleanInterests = Array.isArray(interests)
      ? interests
      : typeof interests === "string"
      ? interests.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    const student = await Student.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          user: req.user.id || req.user._id,
          name: name ? name.trim() : req.user.name,
          skills: cleanSkills,
          education: eduValue,
          degree: eduValue,
          college: college ? college.trim() : "",
          targetRole: targetRole ? targetRole.trim() : "",
          interests: cleanInterests,
          preferredWorkStyle: preferredWorkStyle || "Analytical",
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    if (name) {
      await User.findOneAndUpdate(
        { email: userEmail },
        { $set: { name: name.trim() } }
      ).catch((err) => console.warn("User name sync error:", err.message));
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      student,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile." });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};