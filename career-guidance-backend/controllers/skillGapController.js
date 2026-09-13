const ResumeAnalysis = require("../models/ResumeAnalysis");
const ROLE_REQUIREMENTS = require("../config/roleRequirements");
const {
  getAllDomainNames,
  getAllRoles,
  getRolesByDomain,
  getRoleSkillRequirements,
  getDomainForRole,
} = require("../config/careerDomains");
const CareerRoadmap = require("../models/CareerRoadmap");
const Student = require("../models/Student");
const { generateAIResponse } = require("../services/huggingfaceService");

const normalizeSkill = (skill = "") =>
  skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const hasSkill = (studentSkills, requiredSkill) => {
  const normalizedRequired = normalizeSkill(requiredSkill);

  return studentSkills.some((skill) => {
    const normalizedStudent = normalizeSkill(skill);
    return (
      normalizedStudent === normalizedRequired ||
      normalizedStudent.includes(normalizedRequired) ||
      normalizedRequired.includes(normalizedStudent)
    );
  });
};

// GET /api/skill-gap/domains or /api/career/domains
const getCareerDomainsData = async (req, res) => {
  try {
    const domains = getAllDomainNames();
    const roles = getAllRoles();
    const rolesByDomain = getRolesByDomain();

    return res.status(200).json({
      success: true,
      domains,
      roles,
      rolesByDomain,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career domains data.",
      error: error.message,
    });
  }
};

// GET /api/skill-gap/roles
const getAvailableRoles = async (req, res) => {
  try {
    const domains = getAllDomainNames();
    const roles = getAllRoles();
    const rolesByDomain = getRolesByDomain();

    return res.status(200).json({
      success: true,
      domains,
      roles,
      rolesByDomain,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles.",
      error: error.message,
    });
  }
};

// POST /api/skill-gap/analyze
const analyzeSkillGap = async (req, res) => {
  try {
    const { targetRole: rawRole, skills: inputSkills, currentSkills: altSkills } = req.body;

    const availableRoles = getAllRoles();
    let targetRole = availableRoles.find(
      (r) => r.toLowerCase() === (rawRole || "").toLowerCase().trim()
    );

    if (!targetRole) {
      targetRole = availableRoles.find(
        (r) => (rawRole || "").toLowerCase().includes(r.toLowerCase())
      ) || "Software Developer";
    }

    const userId = req.user?._id || req.user?.id;
    const userEmail = (req.user?.email || "").toLowerCase().trim();

    let collectedSkills = [];

    const passedSkills = inputSkills || altSkills;
    if (Array.isArray(passedSkills) && passedSkills.length > 0) {
      collectedSkills = passedSkills;
    } else if (typeof passedSkills === "string" && passedSkills.trim()) {
      collectedSkills = passedSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    let latestResume = null;
    if (collectedSkills.length === 0 && userId) {
      latestResume = await ResumeAnalysis.findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();
      if (latestResume?.matchedSkills?.length) {
        collectedSkills = latestResume.matchedSkills;
      }
    }

    if (collectedSkills.length === 0 && userEmail) {
      const student = await Student.findOne({ email: userEmail }).lean();
      if (student?.skills?.length) {
        collectedSkills = student.skills;
      }
    }

    const currentSkills = [
      ...new Set(collectedSkills.filter(Boolean).map((s) => s.trim())),
    ];

    const roleRequirements = getRoleSkillRequirements(targetRole);
    const coreSkills = roleRequirements.coreSkills || [];
    const technicalSkills = roleRequirements.technicalSkills || [];
    const recommendedSkills = roleRequirements.recommendedSkills || [];

    const requiredSkills = [
      ...coreSkills,
      ...technicalSkills,
      ...recommendedSkills,
    ];

    const matchedSkills = requiredSkills.filter((s) =>
      hasSkill(currentSkills, s)
    );
    const missingSkills = requiredSkills.filter(
      (s) => !hasSkill(currentSkills, s)
    );

    const readinessScore =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;

    const missingWithPriority = missingSkills.map((skill) => {
      let priority = "Low";
      let whyNeeded = "Recommended to strengthen portfolio and interview clearance.";

      if (coreSkills.includes(skill)) {
        priority = "High";
        whyNeeded = `Core foundation required for entry-level ${targetRole} positions.`;
      } else if (technicalSkills.includes(skill)) {
        priority = "Medium";
        whyNeeded = "Required for technical assessment and hands-on operational rounds.";
      }

      return {
        skill,
        priority,
        whyNeeded,
      };
    });

    const recommendation =
      missingSkills.length === 0
        ? `You meet 100% of the core competencies for ${targetRole}! Focus on mock interview prep.`
        : `Focus on mastering ${missingSkills.slice(0, 3).join(", ")} to reach optimal clearance threshold for ${targetRole}.`;

    return res.status(200).json({
      success: true,
      targetRole,
      targetDomain: getDomainForRole(targetRole),
      readinessScore,
      score: readinessScore,
      skillGapPercentage: 100 - readinessScore,
      currentSkills,
      matched: matchedSkills,
      matchedSkills,
      existingSkills: matchedSkills,
      missing: missingSkills,
      missingSkills,
      missingWithPriority,
      recommendation,
      learningRecommendations: missingWithPriority,
      atsScore: latestResume?.atsScore || 0,
      fileName: latestResume?.fileName || null,
    });
  } catch (error) {
    console.error("Skill gap analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze skill gap.",
      error: error.message,
    });
  }
};

// POST /api/skill-gap/generate-roadmap
const generateCareerRoadmap = async (req, res) => {
  try {
    const { targetRole } = req.body;

    if (!targetRole) {
      return res.status(400).json({
        success: false,
        message: "Please select a dream target role.",
      });
    }

    const userId = req.user._id || req.user.id;
    const roleRequirements = getRoleSkillRequirements(targetRole);

    const latestResume = await ResumeAnalysis.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const currentSkills = [
      ...new Set(
        ((latestResume?.matchedSkills || []).concat(req.user?.skills || []))
          .filter(Boolean)
          .map((skill) => skill.trim())
      ),
    ];

    const requiredSkills = [
      ...(roleRequirements.coreSkills || []),
      ...(roleRequirements.technicalSkills || []),
      ...(roleRequirements.recommendedSkills || []),
    ];

    const matchedSkills = requiredSkills.filter((skill) =>
      hasSkill(currentSkills, skill)
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !hasSkill(currentSkills, skill)
    );

    const readinessScore =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;

    const skillGapPercentage = 100 - readinessScore;

    const prompt = `
You are an expert Career Mentor and Placement Officer.
Create a highly realistic, structured 4-month learning roadmap for a student aiming for the target career role: ${targetRole}.

TARGET DREAM ROLE: ${targetRole}
DOMAIN: ${getDomainForRole(targetRole)}
STUDENT'S CURRENT VERIFIED SKILLS: ${currentSkills.join(", ") || "Basics"}
MISSING SKILLS FOR THE ROLE: ${missingSkills.join(", ") || "Advanced domain concepts"}
CURRENT CAREER READINESS SCORE: ${readinessScore}%

Rules:
1. Focus on practical learning and placement clearance for ${targetRole}.
2. Month 1: Core fundamentals. Month 2: Applied technical/practical skills. Month 3: Portfolio project/case study. Month 4: Placement preparation & interviews.
3. Return ONLY valid JSON matching this schema:
{
  "roadmapSummary": "Short summary explaining the learning journey.",
  "careerOutcome": "Expected outcome after completing the roadmap.",
  "months": [
    {
      "month": 1,
      "title": "Month 1 Title",
      "goal": "Goal",
      "skills": ["Skill 1", "Skill 2"],
      "topics": ["Topic 1", "Topic 2"],
      "activities": ["Activity 1"],
      "project": "Mini project",
      "milestone": "Milestone"
    },
    { "month": 2, "title": "Month 2 Title", "goal": "Goal", "skills": [], "topics": [], "activities": [], "project": "", "milestone": "" },
    { "month": 3, "title": "Month 3 Title", "goal": "Goal", "skills": [], "topics": [], "activities": [], "project": "", "milestone": "" },
    { "month": 4, "title": "Month 4 Title", "goal": "Goal", "skills": [], "topics": [], "activities": [], "project": "", "milestone": "" }
  ]
}
`;

    let roadmapData = null;

    try {
      const aiResponse = await generateAIResponse([
        { role: "system", content: "Always return strictly valid JSON." },
        { role: "user", content: prompt },
      ]);

      let cleaned = String(aiResponse).replace(/```json/gi, "").replace(/```/g, "").trim();
      cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1).trim();
      }
      roadmapData = JSON.parse(cleaned);
    } catch (err) {
      console.warn("AI Roadmap generation fallback to template for:", targetRole);
    }

    if (!roadmapData || !Array.isArray(roadmapData.months) || roadmapData.months.length !== 4) {
      // Clean dynamic fallback if HuggingFace JSON fails or times out
      roadmapData = {
        roadmapSummary: `Structured placement roadmap tailored for ${targetRole}.`,
        careerOutcome: `Job-ready placement candidate for ${targetRole} positions.`,
        months: [
          {
            month: 1,
            title: `Core Fundamentals & Baseline Skills for ${targetRole}`,
            goal: `Build foundational knowledge in ${requiredSkills.slice(0, 3).join(", ")}.`,
            skills: requiredSkills.slice(0, 3),
            topics: ["Principles", "Tool Setup", "Core Syntax / Methods"],
            activities: ["Self-paced exercises", "Weekly domain review"],
            project: "Foundational Practice Assignment",
            milestone: "Master core baseline concepts.",
          },
          {
            month: 2,
            title: `Applied Technical Competencies & Workflow`,
            goal: `Master intermediate capabilities in ${requiredSkills.slice(3, 6).join(", ") || targetRole}.`,
            skills: requiredSkills.slice(3, 6),
            topics: ["Advanced Techniques", "Industry Best Practices", "Data / Process Handling"],
            activities: ["Scenario analysis", "Hands-on lab exercises"],
            project: "Domain Case Study / Application",
            milestone: "Build functional competency.",
          },
          {
            month: 3,
            title: `Portfolio Capstone & Real-World Simulation`,
            goal: `Execute an end-to-end practical project showcasing ${targetRole} expertise.`,
            skills: requiredSkills.slice(0, 5),
            topics: ["Project Architecture", "Execution & Testing", "Documentation"],
            activities: ["Build capstone project", "Document results on GitHub / Portfolio"],
            project: `${targetRole} Capstone Project`,
            milestone: "Publish production-grade portfolio project.",
          },
          {
            month: 4,
            title: `ATS Optimization & Placement Drives`,
            goal: `Prepare for campus recruitment, technical interviews, and HR rounds.`,
            skills: ["Resume Building", "Mock Interviews", "Problem Solving"],
            topics: ["Interview Scenarios", "Case Studies", "Behavioral Preparation"],
            activities: ["ATS Resume scanning", "Mock interview rounds"],
            project: "Placement Drive Portfolio Submission",
            milestone: "Clear campus selection drives.",
          },
        ],
      };
    }

    await CareerRoadmap.updateMany(
      { userId, status: "active" },
      { status: "archived" }
    );

    const roadmap = await CareerRoadmap.create({
      userId,
      targetRole,
      currentSkills,
      missingSkills,
      readinessScore,
      skillGapPercentage,
      roadmapSummary: roadmapData.roadmapSummary || "",
      careerOutcome: roadmapData.careerOutcome || "",
      months: roadmapData.months.map((month) => ({
        month: month.month,
        title: month.title || "",
        goal: month.goal || "",
        skills: month.skills || [],
        topics: month.topics || [],
        activities: month.activities || [],
        project: month.project || "",
        milestone: month.milestone || "",
        completed: false,
      })),
      progress: {
        completedTasks: [],
        completedMonths: [],
        overallProgress: 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Your personalized AI career roadmap has been generated successfully.",
      roadmap,
    });
  } catch (error) {
    console.error("Generate roadmap error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate personalized career roadmap.",
      error: error.message,
    });
  }
};

// GET /api/skill-gap/my-roadmap
const getMyRoadmap = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const roadmap = await CareerRoadmap.findOne({
      userId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!roadmap) {
      const fallback = await CareerRoadmap.findOne({ userId }).sort({
        createdAt: -1,
      });

      if (!fallback) {
        return res.status(404).json({
          success: false,
          message: "No career roadmap found. Generate one first.",
        });
      }

      return res.status(200).json({
        success: true,
        roadmap: fallback,
      });
    }

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("Get roadmap error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career roadmap.",
      error: error.message,
    });
  }
};

// PATCH /api/skill-gap/roadmap/:roadmapId/progress
const updateRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required.",
      });
    }

    const userId = req.user._id || req.user.id;

    const roadmap = await CareerRoadmap.findOne({
      _id: roadmapId,
      userId,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found.",
      });
    }

    if (!roadmap.progress) {
      roadmap.progress = {
        completedTasks: [],
        completedMonths: [],
        overallProgress: 0,
      };
    }

    if (!Array.isArray(roadmap.progress.completedTasks)) {
      roadmap.progress.completedTasks = [];
    }

    const completedTasks = roadmap.progress.completedTasks;
    const taskIndex = completedTasks.indexOf(taskId);

    if (taskIndex > -1) {
      completedTasks.splice(taskIndex, 1);
    } else {
      completedTasks.push(taskId);
    }

    let totalTasks = 0;
    roadmap.months.forEach((month) => {
      totalTasks += month.skills?.length || 0;
      totalTasks += month.topics?.length || 0;
      totalTasks += month.activities?.length || 0;
      if (month.project) totalTasks += 1;
    });

    const completedCount = completedTasks.length;
    const overallProgress =
      totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    roadmap.progress.overallProgress = Math.min(100, Math.max(0, overallProgress));

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Roadmap progress updated successfully.",
      progress: roadmap.progress,
    });
  } catch (error) {
    console.error("Update roadmap progress error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update roadmap progress.",
      error: error.message,
    });
  }
};

module.exports = {
  getCareerDomainsData,
  getAvailableRoles,
  analyzeSkillGap,
  generateCareerRoadmap,
  getMyRoadmap,
  updateRoadmapProgress,
};