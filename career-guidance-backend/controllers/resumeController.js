const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const User = require("../models/User");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { generateAIResponse } = require("../services/huggingfaceService");
const { getDomainForRole, getRoleSkillRequirements } = require("../config/careerDomains");

// ==========================================
// SAFE AI JSON EXTRACTION
// ==========================================
function extractJSONObject(aiResponse) {
  if (!aiResponse) throw new Error("Empty AI response");

  let cleaned = String(aiResponse)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
    throw new Error("No complete JSON object found in AI response");
  }

  return cleaned.slice(jsonStart, jsonEnd + 1).trim();
}

function parseAIAnalysis(aiResponse) {
  const jsonString = extractJSONObject(aiResponse);
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parsing failed:", error.message);
    throw new Error("AI returned invalid JSON");
  }
}

function clampScore(value) {
  const score = Number(value);
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeAnalysis(analysis, targetRole) {
  return {
    atsScore: clampScore(analysis?.atsScore),
    verdict: analysis?.verdict || "Resume analysis completed",
    detectedRole: analysis?.detectedRole || targetRole,
    executiveSummary:
      analysis?.executiveSummary ||
      "The resume has been analyzed against the selected target role.",

    scoreBreakdown: {
      atsParsing: clampScore(analysis?.scoreBreakdown?.atsParsing),
      keywordMatch: clampScore(analysis?.scoreBreakdown?.keywordMatch),
      skillsMatch: clampScore(analysis?.scoreBreakdown?.skillsMatch),
      experienceRelevance: clampScore(analysis?.scoreBreakdown?.experienceRelevance),
      projectQuality: clampScore(analysis?.scoreBreakdown?.projectQuality),
      educationRelevance: clampScore(analysis?.scoreBreakdown?.educationRelevance),
      impactAndAchievements: clampScore(analysis?.scoreBreakdown?.impactAndAchievements),
    },

    matchedSkills: safeArray(analysis?.matchedSkills).slice(0, 15),
    missingSkills: safeArray(analysis?.missingSkills).slice(0, 10),
    technicalSkills: safeArray(analysis?.technicalSkills).slice(0, 15),
    softSkills: safeArray(analysis?.softSkills).slice(0, 8),
    keywordSuggestions: safeArray(analysis?.keywordSuggestions).slice(0, 10),

    strengths: safeArray(analysis?.strengths).slice(0, 5),
    weaknesses: safeArray(analysis?.weaknesses).slice(0, 5),
    strongActionVerbs: safeArray(analysis?.strongActionVerbs).slice(0, 8),

    weakPhrasesToReplace: safeArray(analysis?.weakPhrasesToReplace)
      .filter((item) => item && typeof item === "object")
      .slice(0, 4),

    bulletPointImprovements: safeArray(analysis?.bulletPointImprovements).slice(0, 5),
    formattingSuggestions: safeArray(analysis?.formattingSuggestions).slice(0, 4),
    experienceSuggestions: safeArray(analysis?.experienceSuggestions).slice(0, 4),
    projectSuggestions: safeArray(analysis?.projectSuggestions).slice(0, 4),
    achievementSuggestions: safeArray(analysis?.achievementSuggestions).slice(0, 4),

    recommendedRoles: safeArray(analysis?.recommendedRoles)
      .filter((item) => item && typeof item === "object")
      .slice(0, 4)
      .map((item) => ({
        role: item.role || "Recommended Role",
        matchPercentage: clampScore(item.matchPercentage),
        reason:
          item.reason ||
          "Based on the skills and experience identified in the resume.",
      })),

    careerAdvice: safeArray(analysis?.careerAdvice).slice(0, 5),

    priorityImprovements: safeArray(analysis?.priorityImprovements)
      .filter((item) => item && typeof item === "object")
      .slice(0, 5)
      .map((item) => ({
        priority: item.priority || "Medium",
        issue: item.issue || "Resume improvement needed",
        recommendation:
          item.recommendation ||
          "Review this section and improve it for the target role.",
      })),
  };
}

async function extractTextFromUpload(file, directText) {
  if (directText && directText.trim().length > 20) {
    return directText.trim();
  }

  if (!file) return "";

  let extractedText = "";

  if (
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    try {
      const parsedPdf = await pdfParse(file.buffer);
      extractedText = parsedPdf.text || "";
    } catch (pdfErr) {
      console.warn("Standard PDF parsing failed. Trying OCR:", pdfErr.message);
    }
  }

  if (!extractedText || extractedText.trim().length < 30) {
    try {
      const ocrResult = await Tesseract.recognize(file.buffer, "eng");
      extractedText = ocrResult.data.text || "";
    } catch (ocrErr) {
      console.error("OCR extraction failed:", ocrErr.message);
    }
  }

  return extractedText.trim();
}

// ==========================================
// CONTROLLERS
// ==========================================

const analyzeResume = async (req, res) => {
  try {
    const directText = req.body?.resumeText || "";
    const uploadedFile = req.file;

    const resumeText = await extractTextFromUpload(uploadedFile, directText);

    if (!resumeText || resumeText.length < 20) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract readable text from the uploaded resume. Please upload a clear PDF or image resume.",
      });
    }

    const rawRole = (req.body?.targetRole || "").trim();
    const rawDomain = (req.body?.targetDomain || "").trim();

    const targetRole = rawRole || "General Career Profile";
    const targetDomain = rawDomain || (targetRole !== "General Career Profile" ? getDomainForRole(targetRole) : "General Career Profile");

    const roleSkills = getRoleSkillRequirements(targetRole);
    const coreSkillsStr = (roleSkills.coreSkills || []).join(", ");
    const techSkillsStr = (roleSkills.technicalSkills || []).join(", ");
    const recSkillsStr = (roleSkills.recommendedSkills || []).join(", ");

    const prompt = `
You are an expert ATS Resume Analyzer, Senior Recruiter, and Placement Specialist.
Analyze the candidate's resume specifically for:
TARGET DOMAIN: "${targetDomain}"
TARGET ROLE: "${targetRole}"
ROLE CORE SKILLS: "${coreSkillsStr}"
ROLE TECHNICAL SKILLS: "${techSkillsStr}"
ROLE RECOMMENDED SKILLS: "${recSkillsStr}"

RESUME TEXT:
${resumeText.slice(0, 5000)}

Return ONLY a valid raw JSON object matching this schema without markdown or extra commentary:
{
  "atsScore": 75,
  "verdict": "Strong candidate foundation",
  "detectedRole": "${targetRole}",
  "executiveSummary": "2-3 sentences evaluating candidate readiness for ${targetRole}.",
  "scoreBreakdown": {
    "atsParsing": 80,
    "keywordMatch": 70,
    "skillsMatch": 75,
    "experienceRelevance": 70,
    "projectQuality": 80,
    "educationRelevance": 85,
    "impactAndAchievements": 65
  },
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["missingSkill1", "missingSkill2"],
  "technicalSkills": ["tech1", "tech2"],
  "softSkills": ["soft1", "soft2"],
  "keywordSuggestions": ["kw1", "kw2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "strongActionVerbs": ["Built", "Spearheaded"],
  "weakPhrasesToReplace": [
    { "weak": "worked on", "replacement": "spearheaded development of" }
  ],
  "bulletPointImprovements": ["suggestion 1"],
  "formattingSuggestions": ["suggestion 1"],
  "experienceSuggestions": ["suggestion 1"],
  "projectSuggestions": ["suggestion 1"],
  "achievementSuggestions": ["suggestion 1"],
  "recommendedRoles": [
    { "role": "Role Name", "matchPercentage": 85, "reason": "Reason for fit" }
  ],
  "careerAdvice": ["advice 1"],
  "priorityImprovements": [
    { "priority": "High", "issue": "Issue description", "recommendation": "Step to fix" }
  ]
}

RULES:
- Every score must be an integer between 0 and 100.
- Limit strengths, weaknesses, bullet improvements to max 5 items each.
- Limit recommendedRoles to max 4 roles.
- Limit weakPhrasesToReplace to max 3 items.
`;

    const aiResponse = await generateAIResponse([
      {
        role: "system",
        content:
          "You are a professional ATS resume analyzer. Return only strictly valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    let analysis;
    try {
      const parsedAnalysis = parseAIAnalysis(aiResponse);
      analysis = normalizeAnalysis(parsedAnalysis, targetRole);
    } catch (parseErr) {
      console.error("AI JSON Parse Error:", parseErr.message);
      return res.status(500).json({
        success: false,
        message: "The AI response could not be processed. Please try again.",
      });
    }

    // Persist to MongoDB if user is authenticated
    let savedHistoryId = null;
    if (req.user) {
      try {
        const userId = req.user.id || req.user._id;
        let email = req.user.email;

        if (!email && userId) {
          const u = await User.findById(userId).select("email");
          if (u) email = u.email;
        }

        if (userId && email) {
          const doc = await ResumeAnalysis.create({
            userId,
            userEmail: email.toLowerCase().trim(),
            fileName: uploadedFile?.originalname || "Uploaded-Resume.pdf",
            targetRole,
            detectedRole: analysis.detectedRole,
            atsScore: analysis.atsScore,
            verdict: analysis.verdict,
            matchedSkills: analysis.matchedSkills,
            missingSkills: analysis.missingSkills,
            scoreBreakdown: analysis.scoreBreakdown,
            analysis,
          });
          savedHistoryId = doc._id;
        }
      } catch (dbErr) {
        console.warn("Failed to persist resume analysis history:", dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      historyId: savedHistoryId,
      targetRole,
      detectedRole: analysis.detectedRole,
      resumeTextLength: resumeText.length,
      analysis,
    });
  } catch (error) {
    console.error("Resume analysis controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate resume using AI.",
      error: error.message,
    });
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    let email = req.user?.email;

    if (!email && userId) {
      const u = await User.findById(userId).select("email");
      if (u) email = u.email;
    }

    if (!userId && !email) {
      return res.status(401).json({ success: false, message: "User not identified." });
    }

    const query = userId ? { userId } : { userEmail: email.toLowerCase().trim() };

    const history = await ResumeAnalysis.find(query)
      .select("fileName targetRole detectedRole atsScore verdict createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    console.error("Fetch history error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume history.",
    });
  }
};

const getResumeAnalysisById = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const item = await ResumeAnalysis.findById(req.params.id).lean();

    if (!item) {
      return res.status(404).json({ success: false, message: "Analysis not found." });
    }

    // Verification check
    if (userId && String(item.userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    return res.status(200).json({
      success: true,
      record: item,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch detailed analysis.",
    });
  }
};

module.exports = {
  analyzeResume,
  getResumeHistory,
  getResumeAnalysisById,
};