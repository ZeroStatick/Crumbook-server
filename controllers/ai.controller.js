const aiService = require("../services/ai.service.js");

const getChatResponse = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: "Message is required" 
      });
    }

    const response = await aiService.generateResponse(message, history || []);
    
    res.status(200).json({ 
      success: true, 
      result: response 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatResponse,
};
