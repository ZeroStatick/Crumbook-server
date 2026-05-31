const Guide = require("../models/guide.model.js");
const GuideComment = require("../models/guideComment.model.js");
const Report = require("../models/report.model.js");
const mongoose = require("mongoose");
const aiService = require("../services/ai.service.js");
const sanitizeHtml = require("sanitize-html");
const { DEFAULT_GUIDE_IMAGE } = require("../constants/images.js");
const { GUIDE_CATEGORIES } = require("../constants/guideCategories.js");

// Admin/Moderator: Generate a professional culinary guide using AI
exports.generateOfficialGuide = async (req, res) => {
  try {
    const { customPrompt } = req.body;
    console.log("Generating guide. Custom prompt:", customPrompt || "None");
    
    const randomCategory = GUIDE_CATEGORIES[Math.floor(Math.random() * GUIDE_CATEGORIES.length)];
    const seed = Math.floor(Math.random() * 1000000);

    const prompt = `Generate a professional, high-quality culinary guide or educational article for a platform called Crumbook. 
    ${customPrompt ? `The user has requested this specific focus: "${customPrompt}".` : `Category: ${randomCategory} (Seed: ${seed}).`}
    The guide should focus on a specific technique, kitchen hack, food science concept, or "tips and tricks" for a culinary topic (e.g., "The Art of Knife Skills", "Mastering Mother Sauces", "Tips for Perfect Sourdough Hydration").
    
    Return the response ONLY as a JSON object with these exact keys:
    {
      "title": "A compelling title",
      "image_keywords": ["Specific Food Item", "Ingredient", "Dish name"],
      "ingredients": ["Requirement 1", "Requirement 2"], 
      "instructions": "A detailed, well-formatted HTML string containing the full guide content. Use <h2> for sections, <p> for paragraphs, and <ul>/<li> for lists. Make it professional and educational."
    }
    
    IMPORTANT: 
    1. Respond with VALID JSON ONLY. No markdown blocks, no prefix/suffix text.
    2. image_keywords: Provide 3 keywords describing the FOOD specifically. Avoid people/chefs.`;

    const aiResponse = await aiService.generateResponse(prompt);
    
    // Better JSON cleaning
    let jsonString = aiResponse;
    if (jsonString.includes("```")) {
      jsonString = jsonString.split(/```(?:json)?/)[1]?.split("```")[0] || jsonString;
    }
    jsonString = jsonString.trim();

    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      // Fallback: try to find JSON object in the string if AI added chatter
      const match = jsonString.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsedData = JSON.parse(match[0]);
        } catch (innerError) {
          throw new Error("AI returned unparseable content");
        }
      } else {
        throw new Error("AI returned invalid JSON format");
      }
    }

    if (!parsedData.title || !parsedData.instructions) {
      throw new Error("Incomplete AI response: Missing title or instructions");
    }

    const sanitizedInstructions = sanitizeHtml(String(parsedData.instructions), {
      allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "br"],
      allowedAttributes: {},
    });
    
    const rawKeywords = parsedData.image_keywords || ["food", "dish", "cooking"];
    const keywords = rawKeywords.length > 0 ? rawKeywords : ["food", "culinary", "dish"];
    const primaryFood = keywords[0]?.split(/[\s,]+/)[0]?.toLowerCase() || "culinary";
    
    const randomLock = Math.floor(Math.random() * 1000000);
    const thumbnailUrl = `https://loremflickr.com/1280/720/${primaryFood},food/all?lock=${randomLock}`;

    const newGuide = new Guide({
      title: parsedData.title,
      thumbnailUrl,
      ingredients: parsedData.ingredients || [],
      instructions: sanitizedInstructions,
      author: "AI Chef",
      authorId: req.user._id,
      isAiGenerated: true,
      isOfficialGuide: true
    });

    await newGuide.save();
    
    res.status(201).json({
      success: true,
      message: "Official AI guide generated and published",
      result: newGuide
    });
  } catch (error) {
    console.error("Guide Generation Error:", error);
    
    let userFriendlyMessage = "Failed to generate official guide";
    let status = 500;
    
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      userFriendlyMessage = "The AI Chef has reached its daily limit (Free Tier Quota). Please try again tomorrow or upgrade your API plan.";
      status = 429;
    } else if (error.message?.includes("503") || error.message?.includes("demand")) {
      userFriendlyMessage = "The AI Chef is currently overwhelmed by high demand. Please try again in a few minutes.";
      status = 503;
    } else if (error.message?.includes("safety")) {
      userFriendlyMessage = "The AI Chef refused to generate this content due to safety filters. Please try a different topic.";
      status = 400;
    }

    res.status(status).json({
      success: false,
      message: userFriendlyMessage
    });
  }
};

// Authenticated: Create a manual guide
exports.createManualGuide = async (req, res) => {
  try {
    const { thumbnailUrl: bodyThumbnailUrl, ...guideData } = req.body;

    if (!guideData.title || !guideData.instructions) {
      return res.status(400).json({
        success: false,
        message: "Title and instructions are required"
      });
    }

    // Validate body URL to prevent Stored XSS via 'javascript:' URIs
    let safeFallbackUrl = DEFAULT_GUIDE_IMAGE;
    if (bodyThumbnailUrl && /^https?:\/\//i.test(bodyThumbnailUrl)) {
      safeFallbackUrl = bodyThumbnailUrl;
    }

    // Handle image upload from multer or fallback to provided URL/Default
    guideData.thumbnailUrl = req.file?.path || req.file?.url || req.file?.secure_url || safeFallbackUrl;

    // Sanitize instructions to prevent XSS. Enforce string type.
    guideData.instructions = sanitizeHtml(String(guideData.instructions), {
      allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "br"],
      allowedAttributes: {}, // No attributes allowed for simplicity/security
    });

    // Sanitize title and ingredients array
    if (guideData.title) {
      guideData.title = sanitizeHtml(String(guideData.title), { allowedTags: [], allowedAttributes: {} });
    }
    if (Array.isArray(guideData.ingredients)) {
      guideData.ingredients = guideData.ingredients.map(ing => 
        sanitizeHtml(String(ing), { allowedTags: [], allowedAttributes: {} })
      );
    }

    const newGuide = new Guide({
      ...guideData,
      author: req.user.name || "Crumbook User",
      authorId: req.user._id,
      isAiGenerated: false,
      isOfficialGuide: false
    });

    await newGuide.save();

    res.status(201).json({
      success: true,
      message: "Guide created successfully",
      result: newGuide
    });
  } catch (error) {
    console.error("Manual Guide Creation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create manual guide"
    });
  }
};

// Admin/Moderator or Author: Delete a guide
exports.deleteGuide = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const guide = await Guide.findById(req.params.id).session(session);
    if (!guide) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    // Permission check: Admin (role 2), Owner (role 3), or Author
    const isAuthor = guide.authorId && guide.authorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role >= 2;

    if (!isAdmin && !isAuthor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins or the author can delete this guide"
      });
    }

    await Guide.findByIdAndDelete(req.params.id).session(session);
    
    // Also delete associated comments and reports
    const comments = await GuideComment.find({ guideId: req.params.id }).select("_id").session(session);
    const commentIds = comments.map(c => c._id);

    await GuideComment.deleteMany({ guideId: req.params.id }).session(session);
    await Report.deleteMany({ 
      $or: [
        { guide_id: req.params.id },
        { guide_comment_id: { $in: commentIds } }
      ]
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      result: { message: "Guide and associated comments purged" }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Failed to delete guide"
    });
  }
};

// Admin/Moderator or Author: Update a guide
exports.updateGuide = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    // Authorization: Author or Admin/Moderator
    const isAuthor = guide.authorId && guide.authorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role >= 2;

    if (!isAdmin && !isAuthor) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only update your own guides or must be an admin"
      });
    }

    const { thumbnailUrl: bodyThumbnailUrl, ...otherData } = req.body;
    const updateData = { ...otherData };

    if (updateData.instructions) {
      updateData.instructions = sanitizeHtml(String(updateData.instructions), {
        allowedTags: ["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "br"],
        allowedAttributes: {},
      });
    }

    if (updateData.title) {
      updateData.title = sanitizeHtml(String(updateData.title), { allowedTags: [], allowedAttributes: {} });
    }
    if (Array.isArray(updateData.ingredients)) {
      updateData.ingredients = updateData.ingredients.map(ing => 
        sanitizeHtml(String(ing), { allowedTags: [], allowedAttributes: {} })
      );
    }

    if (req.file) {
      updateData.thumbnailUrl = req.file.path || req.file.url || req.file.secure_url;
    } else if (bodyThumbnailUrl && /^https?:\/\//i.test(bodyThumbnailUrl)) {
      updateData.thumbnailUrl = bodyThumbnailUrl;
    }

    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Guide updated successfully",
      result: updatedGuide
    });
  } catch (error) {
    console.error("Guide Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update guide"
    });
  }
};

// Public: Get all guides (AI + User)
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      result: guides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch guides"
    });
  }
};

// Public: Get a single guide with comments
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ success: false, message: "Guide not found" });
    }

    const comments = await GuideComment.find({ guideId: req.params.id })
      .populate("comment_author", "name profile_picture")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      result: {
        guide,
        comments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch guide details"
    });
  }
};

// Authenticated: Add a comment to a guide
exports.addCommentToGuide = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const newComment = new GuideComment({
      guideId: req.params.id,
      comment_author: req.user._id,
      text
    });

    await newComment.save();
    
    // Populate author for immediate UI update
    await newComment.populate("comment_author", "name profile_picture");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      result: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment"
    });
  }
};

// Admin/Moderator or Author: Delete a comment from a guide
exports.deleteCommentFromGuide = async (req, res) => {
  try {
    const comment = await GuideComment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const isAuthor = comment.comment_author.toString() === req.user._id.toString();
    const isAdmin = req.user.role >= 2;

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own comments or must be an admin"
      });
    }

    await GuideComment.findByIdAndDelete(req.params.commentId);

    // Also delete associated reports
    await Report.deleteMany({ guide_comment_id: req.params.commentId });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete comment"
    });
  }
};
