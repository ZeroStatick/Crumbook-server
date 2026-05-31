const Report = require("../models/report.model.js");
const Recipe = require("../models/recipe.model.js");
const Comment = require("../models/comment.model.js");
const Guide = require("../models/guide.model.js");
const GuideComment = require("../models/guideComment.model.js");

const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("recipe_id", "title")
      .populate("guide_id", "title")
      .populate({
        path: "comment_id",
        populate: [
          { path: "comment_author", select: "name" },
          { path: "commented_recipe", select: "title" }
        ],
      })
      .populate({
        path: "guide_comment_id",
        populate: [
          { path: "comment_author", select: "name" },
          { path: "guideId", select: "title" }
        ],
      })
      .populate("user_id", "name email");
    res.status(200).json({ success: true, result: reports });
  } catch (e) {
    next(e);
  }
};

const createReport = async (req, res, next) => {
  try {
    const { target_type, recipe_id, comment_id, guide_id, guide_comment_id } = req.body;
    const current_user_id = req.user._id.toString();

    if (target_type === "recipe") {
      const recipe = await Recipe.findById(recipe_id);
      if (!recipe) {
        return res.status(404).json({ success: false, message: "Recipe not found" });
      }
      if (recipe.author.toString() === current_user_id) {
        return res.status(400).json({ success: false, message: "You cannot report your own recipe" });
      }
      const existingReport = await Report.findOne({ recipe_id, user_id: current_user_id });
      if (existingReport) {
        return res.status(400).json({ success: false, message: "You have already reported this recipe" });
      }
    } else if (target_type === "comment") {
      const comment = await Comment.findById(comment_id);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }
      if (comment.comment_author.toString() === current_user_id) {
        return res.status(400).json({ success: false, message: "You cannot report your own comment" });
      }
      const existingReport = await Report.findOne({ comment_id, user_id: current_user_id });
      if (existingReport) {
        return res.status(400).json({ success: false, message: "You have already reported this comment" });
      }
    } else if (target_type === "guide_comment") {
      const comment = await GuideComment.findById(guide_comment_id);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Guide comment not found" });
      }
      if (comment.comment_author.toString() === current_user_id) {
        return res.status(400).json({ success: false, message: "You cannot report your own comment" });
      }
      const existingReport = await Report.findOne({ guide_comment_id, user_id: current_user_id });
      if (existingReport) {
        return res.status(400).json({ success: false, message: "You have already reported this comment" });
      }
    } else if (target_type === "guide") {
      const guide = await Guide.findById(guide_id);
      if (!guide) {
        return res.status(404).json({ success: false, message: "Guide not found" });
      }

      // Robust self-reporting check: Prioritize authorId (ObjectId)
      const isAuthorById = guide.authorId && guide.authorId.toString() === current_user_id;
      
      // Fallback for user-authored guides if authorId is missing (legacy/external)
      // and name is available in both guide and context.
      const isAuthorByName = guide.author && req.user.name && guide.author === req.user.name;

      if (isAuthorById || (!guide.isAiGenerated && isAuthorByName)) {
        return res.status(400).json({ success: false, message: "You cannot report your own guide" });
      }
      const existingReport = await Report.findOne({ guide_id, user_id: current_user_id });
      if (existingReport) {
        return res.status(400).json({ success: false, message: "You have already reported this guide" });
      }
    }

    const reportData = {
      sort: req.body.sort,
      reason: req.body.reason,
      target_type,
      user_id: req.user._id,
    };

    if (target_type === "recipe") reportData.recipe_id = recipe_id;
    if (target_type === "comment") reportData.comment_id = comment_id;
    if (target_type === "guide_comment") reportData.guide_comment_id = guide_comment_id;
    if (target_type === "guide") reportData.guide_id = guide_id;

    const newReport = await Report.create(reportData);
    
    res.status(201).json({ success: true, result: newReport });
  } catch (e) {
    next(e);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.status(200).json({ success: true, result: deletedReport });
  } catch (e) {
    next(e);
  }
};

module.exports = { getAllReports, createReport, deleteReport };
