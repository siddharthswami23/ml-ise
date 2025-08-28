const { chatSession } = require('./configs/AiModel'); // adjust path
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
}

/**
 * Sends a prompt to Gemini AI chat session and returns JSON result
 * @param {string} prompt - The user prompt
 * @returns {Promise<Object>} - Parsed JSON result from AI
 */
async function getAiResponse(prompt) {
  try {
    const result = await chatSession.sendMessage(prompt);

    // Safely parse the response
    let parsedResult;
    try {
      parsedResult = JSON.parse(result.response.text?.() || result.response || "{}");
    } catch (err) {
      parsedResult = { error: "Failed to parse response as JSON", raw: result.response };
    }

    return parsedResult;
  } catch (e) {
    return { error: e.message || e };
  }
}

module.exports = { getAiResponse, apiKey };
