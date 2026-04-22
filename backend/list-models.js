const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
  try {
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await modelsResponse.json();
    console.log("AVAILABLE MODELS:", data.models.map(m => m.name));
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

checkModels();
