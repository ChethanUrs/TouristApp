const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Fetches structured destination details using Gemini AI
 * @param {string} placeName - The name of the place to fetch details for
 */
const fetchDestinationDetails = async (placeName) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate a professional travel profile for a place called "${placeName}".
    Return the response ONLY as a valid JSON object with the following structure:
    {
      "name": "Full official name of the place",
      "description": "A compelling 2-3 sentence description",
      "location": {
        "city": "Main city or region",
        "country": "Country name",
        "coordinates": {
          "lat": numeric_latitude,
          "lng": numeric_longitude
        }
      },
      "category": "Choose one from: beach, mountain, city, heritage, adventure",
      "suggestedImages": ["Keyword for high quality travel photo 1", "Keyword for high quality travel photo 2"],
      "bestTimeToVisit": "Optimal season",
      "isFeatured": false
    }
    
    Ensure the JSON is clean and valid. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown or extra whitespace
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini AI Fetch Error:", error);
    throw new Error("Failed to fetch destination details from AI");
  }
};

module.exports = { fetchDestinationDetails };
