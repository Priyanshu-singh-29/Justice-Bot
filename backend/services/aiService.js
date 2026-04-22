const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes case data using Gemini AI.
 * @param {string} title - Case title
 * @param {string} description - Case description
 * @param {string} type - Case type
 */
const analyzeCase = async (title, description, type) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      You are a senior legal AI assistant. Analyze the following legal case description and provide a structured JSON response.
      
      Case Title: ${title}
      Case Type: ${type}
      Description: ${description}
      
      The JSON response MUST include:
      - summary: A concise 2-3 sentence overview of the case.
      - legalPoints: An array of key legal points or concerns identified.
      - recommendations: An array of steps or advice for the client/lawyer.
      - riskLevel: Either "low", "medium", or "high" based on the complexity/severity.

      Return ONLY the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini Raw Response:", text);

    // Clean JSON if needed (sometimes LLMs wrap in markdown code blocks)
    const cleanText = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Attempted to parse:", cleanText);
      throw new Error("AI returned invalid JSON format");
    }
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    throw error;
  }
};

module.exports = {
  analyzeCase
};