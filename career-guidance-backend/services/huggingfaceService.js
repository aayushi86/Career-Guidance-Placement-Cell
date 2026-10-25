const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);

// ==========================================
// GENERATE AI RESPONSE (Hugging Face)
// Uses Qwen2.5-7B-Instruct (much cheaper than Qwen3-32B).
// Requires active HF inference credits at hf.co/settings/billing.
// Override model via HF_MODEL env var if needed.
// ==========================================

async function generateAIResponse(messages) {
  try {
    const model = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";

    const response = await hf.chatCompletion({
      model,
      messages,
      // Resume analysis returns a large JSON object; keep tokens generous.
      max_tokens: 3000,
      // Lower temperature = more consistent JSON.
      temperature: 0.1,
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      console.error(
        "Invalid Hugging Face response:",
        JSON.stringify(response, null, 2)
      );
      throw new Error("AI returned an empty response");
    }

    return content.trim();

  } catch (error) {
    const msg = error.message || "";

    // Classify the error for clearer logging
    if (msg.includes("no remaining credits") || msg.includes("Purchase pre-paid credits")) {
      console.error(
        "Hugging Face Error: Inference credits exhausted. " +
        "Add credits at https://huggingface.co/settings/billing or switch AI_PROVIDER=gemini in .env."
      );
    } else if (msg.includes("401") || msg.includes("Unauthorized") || msg.includes("Invalid token")) {
      console.error("Hugging Face Error: Authentication failed — check HF_TOKEN in .env.");
    } else if (msg.includes("429") || msg.includes("rate limit")) {
      console.error("Hugging Face Error: Rate limit hit. Wait before retrying.");
    } else {
      console.error("Hugging Face Error:", msg);
    }

    throw new Error("AI service is currently unavailable");
  }
}

module.exports = {
  generateAIResponse,
};
