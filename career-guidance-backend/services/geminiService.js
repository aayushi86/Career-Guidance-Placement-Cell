const { GoogleGenAI } = require("@google/genai");

// ==========================================
// GENERATE AI RESPONSE (Gemini)
// Uses ai.models.generateContent — the correct method for @google/genai v2+
// Supports the standard { role, content } messages array interface.
// System messages are forwarded via the systemInstruction config field.
// ==========================================

async function generateAIResponse(messages) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // gemini-2.5-flash is free-tier eligible via Google AI Studio
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 60000);

    const items = Array.isArray(messages) ? messages : [messages];

    // Separate system messages from user/assistant turns
    const systemParts = items
        .filter((m) => m && m.role === "system")
        .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content)))
        .join("\n");

    // Build Gemini contents array from non-system messages
    // Gemini only accepts "user" and "model" roles; map "assistant" -> "model"
    const contents = items
        .filter((m) => m && m.role !== "system")
        .map((m) => {
            if (typeof m === "string") {
                return { role: "user", parts: [{ text: m }] };
            }
            const role = m.role === "assistant" ? "model" : "user";
            const text =
                typeof m.content === "string"
                    ? m.content
                    : JSON.stringify(m.content ?? m.text ?? "");
            return { role, parts: [{ text }] };
        });

    // If all messages were system messages, create a single user message
    if (contents.length === 0) {
        contents.push({ role: "user", parts: [{ text: systemParts || "Hello" }] });
    }

    const requestConfig = {
        model,
        contents,
        config: {
            maxOutputTokens: 3000,
            temperature: 0.1,
        },
    };

    // Attach system instruction if any system messages were found
    if (systemParts) {
        requestConfig.config.systemInstruction = systemParts;
    }

    let timer;

    try {
        const result = await Promise.race([
            ai.models.generateContent(requestConfig),
            new Promise((_, reject) => {
                timer = setTimeout(
                    () => reject(new Error("Gemini request timed out.")),
                    timeoutMs
                );
            }),
        ]);

        const text = result.text;

        if (typeof text !== "string" || !text.trim()) {
            throw new Error("Gemini returned an empty response.");
        }

        return text.trim();
    } catch (error) {
        console.error("Gemini Error:", error.message);
        throw new Error("AI service is currently unavailable.");
    } finally {
        clearTimeout(timer);
    }
}

module.exports = { generateAIResponse };