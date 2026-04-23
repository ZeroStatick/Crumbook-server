const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables");
    }
    this.genAI = new GoogleGenerativeAI(apiKey || "");
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "You are the 'Crumbook AI Chef', a professional, friendly, and knowledgeable culinary expert. Your goal is to help users with recipe ideas, cooking techniques, meal planning, and food-related questions. You should provide clear, concise instructions and be encouraging. If asked about things unrelated to food or cooking, politely steer the conversation back to the kitchen.",
    });
  }

  async generateResponse(message, history = []) {
    try {
      const chat = this.model.startChat({
        history: history
          .filter(msg => msg.text && msg.text.trim() !== "")
          .map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          })),
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating AI response:", error);
      // Log more details if available
      if (error.response) {
        console.error("AI Provider Error Response:", error.response);
      }
      throw error; // Throw the original error instead of a generic one for better debugging
    }
  }
}

module.exports = new AIService();
