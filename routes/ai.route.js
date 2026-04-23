const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller.js");
const { auth } = require("../middleware/auth.middleware.js");

// Protect AI chat with authentication to prevent API abuse
router.post("/chat", auth, aiController.getChatResponse);

module.exports = router;
