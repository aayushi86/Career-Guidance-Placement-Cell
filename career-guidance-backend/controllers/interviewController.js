const MockInterview = require("../models/MockInterview");
const CareerRoadmap = require("../models/CareerRoadmap");
const { generateAIResponse } = require("../services/huggingfaceService");

// ==========================================
// GENERATE AI MOCK INTERVIEW QUESTIONS
// POST /api/interviews/generate
// ==========================================
const generateMockInterview = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Retrieve active or most recent roadmap
    const roadmap =
      (await CareerRoadmap.findOne({ userId, status: "active" }).sort({
        createdAt: -1,
      })) ||
      (await CareerRoadmap.findOne({ userId }).sort({ createdAt: -1 }));

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message:
          "No career roadmap found. Please generate your AI career roadmap first.",
      });
    }

    const targetRole = roadmap.targetRole || "General Career Role";
    const currentSkills = roadmap.currentSkills || [];
    const missingSkills = roadmap.missingSkills || [];

    const prompt = `
You are an expert Technical Interviewer and Senior Hiring Manager.

Generate exactly 5 targeted interview questions for a student based on this profile:
TARGET ROLE: ${targetRole}
CURRENT VERIFIED SKILLS: ${currentSkills.join(", ") || "General fundamentals"}
IDENTIFIED SKILL GAPS: ${missingSkills.join(", ") || "None"}

Requirements:
1. Generate exactly 5 questions.
2. Provide a 4:1 mix of technical and situational/behavioral questions.
3. Heavily target the student's identified skill gaps.
4. Difficulty must be one of: "Easy", "Medium", "Hard".
5. Return ONLY a valid, raw JSON array. Do not wrap in markdown quotes, no explanations outside JSON.

Use this JSON schema strictly:
[
  {
    "question": "Question text here",
    "category": "technical",
    "skillFocus": "Skill name",
    "difficulty": "Medium"
  }
]
`;

    const aiResponse = await generateAIResponse([
      {
        role: "system",
        content:
          "You are a strict JSON interview generator. Output only a raw JSON array. Never include markdown fences or thinking traces.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    let questions;

    try {
      let cleaned = String(aiResponse)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      const startIdx = cleaned.indexOf("[");
      const endIdx = cleaned.lastIndexOf("]");

      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleaned = cleaned.slice(startIdx, endIdx + 1).trim();
      }

      questions = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Interview generation JSON parse error:", aiResponse);
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid interview questions format.",
      });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "AI failed to produce interview questions.",
      });
    }

    const interview = await MockInterview.create({
      userId,
      targetRole,
      currentSkills,
      missingSkills,
      questions: questions.slice(0, 5),
    });

    return res.status(201).json({
      success: true,
      message: "AI mock interview generated successfully.",
      interview,
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI mock interview.",
      error: error.message,
    });
  }
};

// ==========================================
// SUBMIT ANSWER & GET AI EVALUATION
// POST /api/interviews/:interviewId/questions/:questionId/answer
// ==========================================
const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionId } = req.params;
    const { answer } = req.body;
    const userId = req.user._id || req.user.id;

    if (!answer || answer.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a substantive answer to evaluate.",
      });
    }

    const interview = await MockInterview.findOne({ _id: interviewId, userId });
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Mock interview session not found.",
      });
    }

    const questionItem = interview.questions.id(questionId);
    if (!questionItem) {
      return res.status(404).json({
        success: false,
        message: "Question not found in this interview session.",
      });
    }

    const prompt = `
You are an expert Technical Interviewer evaluating a candidate's response.

ROLE: ${interview.targetRole}
SKILL FOCUS: ${questionItem.skillFocus}
DIFFICULTY: ${questionItem.difficulty}

QUESTION: ${questionItem.question}

CANDIDATE'S ANSWER: ${answer}

Evaluate the candidate's answer and return ONLY a valid raw JSON object matching this structure:
{
  "score": 85,
  "strengths": ["Clear mention of specific methods", "Good conceptual clarity"],
  "improvements": ["Could provide a concrete code syntax example", "Missing edge case consideration"],
  "idealAnswer": "A model answer demonstrating industry best practices.",
  "overallFeedback": "Strong foundational knowledge, but needs deeper technical precision."
}
`;

    const aiResponse = await generateAIResponse([
      {
        role: "system",
        content: "You are an objective interview evaluator. Return only raw JSON. Never include markdown fences or thinking traces.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    let feedbackData;
    try {
      let cleaned = String(aiResponse)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      const startIdx = cleaned.indexOf("{");
      const endIdx = cleaned.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleaned = cleaned.slice(startIdx, endIdx + 1).trim();
      }

      feedbackData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Evaluation JSON parse error:", aiResponse);
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid evaluation structure.",
      });
    }

    questionItem.studentAnswer = answer;
    questionItem.score = feedbackData.score || 70;
    questionItem.feedback = {
      strengths: feedbackData.strengths || [],
      improvements: feedbackData.improvements || [],
      idealAnswer: feedbackData.idealAnswer || "",
      overallFeedback: feedbackData.overallFeedback || "",
    };
    questionItem.answeredAt = new Date();

    const answeredQuestions = interview.questions.filter((q) => q.score !== null && q.score !== undefined);
    const totalScore = answeredQuestions.reduce((acc, curr) => acc + curr.score, 0);
    interview.overallScore = Math.round(totalScore / answeredQuestions.length);

    if (answeredQuestions.length === interview.questions.length) {
      interview.completed = true;
      interview.completedAt = new Date();
    }

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Answer evaluated successfully.",
      question: questionItem,
      overallScore: interview.overallScore,
      completed: interview.completed,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to evaluate answer.",
      error: error.message,
    });
  }
};

// ==========================================
// GET ACTIVE / LATEST INTERVIEW
// GET /api/interviews/latest
// ==========================================
const getLatestInterview = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const interview = await MockInterview.findOne({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interview: interview || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview.",
      error: error.message,
    });
  }
};

module.exports = {
  generateMockInterview,
  submitAnswer,
  getLatestInterview,
};