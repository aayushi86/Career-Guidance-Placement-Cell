const { InferenceClient } = require("@huggingface/inference");

const hf = new InferenceClient(process.env.HF_TOKEN);


// ==========================================
// GENERATE AI RESPONSE
// ==========================================

async function generateAIResponse(messages) {
  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen3-32B",

      messages,

      // Your resume analysis now returns a large JSON object.
      // 1200 can truncate the response.
      max_tokens: 3000,

      // Lower temperature = more consistent JSON.
      temperature: 0.1,
    });


    const content =
      response?.choices?.[0]?.message?.content;


    if (!content) {
      console.error(
        "Invalid Hugging Face response:",
        JSON.stringify(response, null, 2)
      );

      throw new Error(
        "AI returned an empty response"
      );
    }


    return content.trim();

  } catch (error) {

    console.error(
      "Hugging Face Error:",
      error.message
    );


    throw new Error(
      "AI service is currently unavailable"
    );
  }
}


module.exports = {
  generateAIResponse,
};