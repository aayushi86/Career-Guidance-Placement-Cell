const { generateAIResponse } = require("../services/huggingfaceService");
const { getStudentProfileData } = require("../services/jobMatchingService");
const { getDomainForRole } = require("../config/careerDomains");

const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please provide a message",
      });
    }

    let contextPrompt = "You are CareerAI, an intelligent multi-domain career guidance assistant for college students and placement candidates. Provide practical, clear, encouraging, and concise career advice tailored across technical, analytical, business, financial, creative, and management fields.";

    if (req.user && req.user.role === "student") {
      try {
        const profileData = await getStudentProfileData(req.user);
        const domain = profileData.targetDomain || getDomainForRole(profileData.targetRole);

        contextPrompt += `\n\nStudent Profile Context:\n`;
        contextPrompt += `- Student Name: ${req.user.name || "Student"}\n`;
        contextPrompt += `- Academic Degree / Background: ${profileData.degree}\n`;
        contextPrompt += `- Target Domain: ${domain}\n`;
        contextPrompt += `- Target Career Role: ${profileData.targetRole}\n`;
        contextPrompt += `- Key Verified Skills: ${profileData.studentSkills.join(", ") || "General competencies"}\n`;
        if (profileData.interests?.length > 0) {
          contextPrompt += `- Stated Interests: ${profileData.interests.join(", ")}\n`;
        }
        if (profileData.atsScore !== null) {
          contextPrompt += `- ATS Resume Score: ${profileData.atsScore}%\n`;
        }
        if (profileData.roadmapProgress > 0) {
          contextPrompt += `- Learning Roadmap Progress: ${profileData.roadmapProgress}%\n`;
        }
        contextPrompt += `\nTailor your response to this student's specific domain (${domain}) and target role (${profileData.targetRole}). Keep guidance actionable, realistic, and focused on placement readiness. Never leak data from other users.`;
      } catch (ctxErr) {
        console.error("Assistant context gathering error:", ctxErr.message);
      }
    }

    const answer = await generateAIResponse([
      {
        role: "system",
        content: contextPrompt,
      },
      {
        role: "user",
        content: message.trim(),
      },
    ]);

    return res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Assistant Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get AI response",
    });
  }
};

module.exports = {
  askAI,
};