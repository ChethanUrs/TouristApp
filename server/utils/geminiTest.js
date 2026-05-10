const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const testGemini = async () => {
    console.log("Starting Gemini API Test...");
    console.log("API Key found:", !!process.env.GEMINI_API_KEY);
    
    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: GEMINI_API_KEY not found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("Sending test prompt...");
        const result = await model.generateContent("Say 'Gemini is connected' in one sentence.");
        const response = await result.response;
        const text = response.text();
        
        console.log("Gemini Response:", text);
    } catch (error) {
        console.error("Gemini API Test FAILED!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Response Data:", error.response.data);
        }
    }
};

testGemini();
