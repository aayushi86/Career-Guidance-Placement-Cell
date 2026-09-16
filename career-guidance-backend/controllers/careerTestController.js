const CareerTest = require("../models/CareerTest");
const Student = require("../models/Student");
const { calculateCareerScore } = require("../services/careerScoringService");
const { getCareerRoadmap } = require("../services/careerRoadmapService");
const { getDomainForRole } = require("../config/careerDomains");

// POST /api/career-test
const submitCareerTest = async (req, res) => {
  try {
    const {
      name,
      email,
      interests = [],
      skills = [],
      aptitudes = [],
      education = "Undergraduate / Graduate",
      preferredWorkStyle = "Analytical",
      preferredDomain = "",
    } = req.body;

    const userEmail = req.user?.email || email;
    const studentName = req.user?.name || name || "Student";

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Student email is required.",
      });
    }

    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one interest area.",
      });
    }

    // Calculate deterministic multi-domain match scores
    const scoringResult = calculateCareerScore(
      skills,
      interests,
      aptitudes,
      preferredWorkStyle,
      preferredDomain
    );

    const { careerResults, topCareer, topDomain, topDomainScore, domainBreakdown } = scoringResult;

    if (!topCareer) {
      return res.status(400).json({
        success: false,
        message: "Unable to calculate career recommendations.",
      });
    }

    // Fetch roadmap items for top career
    const roadmap = getCareerRoadmap(topCareer.career).map((item) => ({
      ...item,
      completed: false,
    }));

    const matchedSkills = topCareer.matchedSkills || [];
    const matchedInterests = topCareer.matchedInterests || [];

    const reason =
      `Your strongest domain match is ${topDomain} (${topDomainScore}%) with top role recommendation ${topCareer.career} (${topCareer.score}%). ` +
      `This recommendation is calculated from your selected interests (${interests.slice(0, 3).join(", ")}), ` +
      `technical/core skills, aptitude, and ${preferredWorkStyle} work style.`;

    // Save assessment into CareerTest collection
    const savedTest = await CareerTest.create({
      name: studentName,
      email: userEmail,
      education,
      preferredWorkStyle,
      interests,
      skills,
      score: topCareer.score,
      recommendedCareer: topCareer.career,
      topRecommendation: topCareer.career,
      reason,
      careerMatches: careerResults.slice(0, 6),
      matchScores: careerResults.slice(0, 6),
      roadmap,
    });

    // Update student profile in MongoDB
    await Student.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          name: studentName,
          email: userEmail,
          skills,
          interests,
          degree: education,
          targetDomain: topDomain,
          targetRole: topCareer.career,
          readinessScore: topCareer.score,
          careerTestDone: true,
          latestTestId: savedTest._id,
        },
      },
      { upsert: true, new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Multi-domain career assessment completed successfully.",
      result: {
        id: savedTest._id,
        topDomain,
        topDomainScore,
        topRecommendation: topCareer.career,
        recommendedCareer: topCareer.career,
        career: topCareer.career,
        score: topCareer.score,
        overallMatchScore: topCareer.score,
        reason,
        careerMatches: careerResults.slice(0, 6),
        domainBreakdown,
        roadmap,
      },
    });
  } catch (error) {
    console.error("Career test submit error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting career test.",
    });
  }
};

// GET /api/career-test
const getCareerTestResults = async (req, res) => {
  try {
    let userEmail = (req.user?.email || "").toLowerCase().trim();

    if (req.user?.role === "admin" && req.query.email) {
      userEmail = req.query.email.toLowerCase().trim();
    }

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Student email / authentication is required.",
      });
    }

    const results = await CareerTest.find({ email: userEmail }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Career test history error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career test results.",
    });
  }
};

// PATCH /api/career-test/:id/roadmap-step
const updateRoadmapStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepNumber, completed } = req.body;

    const record = await CareerTest.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Career test record not found.",
      });
    }

    const studentEmail = (req.user?.email || "").toLowerCase().trim();
    if (req.user?.role !== "admin" && record.email.toLowerCase().trim() !== studentEmail) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You cannot modify another student's career roadmap.",
      });
    }

    const stepIndex = record.roadmap.findIndex(
      (step) => Number(step.step) === Number(stepNumber)
    );

    if (stepIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Invalid roadmap step.",
      });
    }

    record.roadmap[stepIndex].completed = Boolean(completed);
    await record.save();

    return res.status(200).json({
      success: true,
      message: "Roadmap progress updated.",
      roadmap: record.roadmap,
    });
  } catch (error) {
    console.error("Roadmap update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update roadmap.",
    });
  }
};

module.exports = {
  submitCareerTest,
  getCareerTestResults,
  updateRoadmapStep,
};