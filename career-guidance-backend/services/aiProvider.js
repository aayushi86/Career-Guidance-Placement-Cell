const { generateAIResponse: generateGeminiResponse } = require("./geminiService");
const { generateAIResponse: generateHuggingFaceResponse } = require("./huggingfaceService");

// ==========================================
// AI PROVIDER ROUTER
// Reads AI_PROVIDER from .env (default: "gemini").
// Supported values: "gemini" | "huggingface"
// Required env vars:
//   gemini      -> GEMINI_API_KEY (get free key at aistudio.google.com)
//   huggingface -> HF_TOKEN (requires active inference credits)
// ==========================================

const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

// Warn at startup if the configured provider lacks its key
if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
    console.warn(
        "[AI Provider] WARNING: AI_PROVIDER=gemini but GEMINI_API_KEY is not set in .env. " +
        "Get a free key at https://aistudio.google.com/apikey and add it to the backend .env file."
    );
}

if (provider === "huggingface" && !process.env.HF_TOKEN) {
    console.warn(
        "[AI Provider] WARNING: AI_PROVIDER=huggingface but HF_TOKEN is not set in .env."
    );
}

function generateAIResponse(messages) {
    if (provider === "gemini") {
        return generateGeminiResponse(messages);
    }

    if (provider === "huggingface") {
        return generateHuggingFaceResponse(messages);
    }

    throw new Error(`Unsupported AI_PROVIDER: "${provider}". Valid values are "gemini" or "huggingface".`);
}

module.exports = { generateAIResponse };
