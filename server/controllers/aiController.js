const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateInsights = async (req, res) => {
  const { name, location, category } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional travel guide. Provide advanced insights for the tourist destination: "${name}" located in "${location.city}, ${location.country}". The category is "${category}".
    Return ONLY a valid JSON object with these keys:
    {
      "itinerary": "concise 3-day plan",
      "hiddenGems": ["gem 1", "gem 2", "gem 3"],
      "localTips": ["tip 1", "tip 2", "tip 3"],
      "bestTimeToVisit": "best months"
    }
    No markdown formatting. No extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const insights = JSON.parse(cleanJson);

    res.json(insights);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to generate AI insights', 
      error: error.message,
      details: error.stack
    });
  }
};

const chatWithAI = async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful AI travel assistant for "TouristApp". 
    Context: ${context || 'The user is browsing destinations.'}
    User asked: "${message}"
    
    Provide a helpful, friendly, and concise response. If the user asks about destinations, suggest looking at our featured ones.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to chat with AI', 
      error: error.message,
      details: error.stack
    });
  }
};

const searchPlaceAI = async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a professional travel planner. Generate a destination profile for: "${keyword}".
    Return ONLY a valid JSON object with these keys:
    {
      "name": "formal name",
      "description": "2-3 sentences",
      "location": { "city": "...", "country": "..." },
      "category": "one of [beach, mountain, city, heritage, adventure]",
      "itinerary": "3-day plan",
      "hiddenGems": ["gem 1", "gem 2", "gem 3"],
      "localTips": ["tip 1", "tip 2", "tip 3"],
      "bestTimeToVisit": "months",
      "funFact": "cool fact"
    }
    No markdown formatting. No extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(cleanJson);

    res.json(resultJson);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to generate travel plan', 
      error: error.message
    });
  }
};

module.exports = { generateInsights, chatWithAI, searchPlaceAI };
