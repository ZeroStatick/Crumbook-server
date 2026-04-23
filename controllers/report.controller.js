const Report = require("../models/report.model.js");
const Recipe = require("../models/recipe.model.js");
const Comment = require("../models/comment.model.js");

const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate("recipe_id", "title")
      .populate({
        path: "comment_id",
        populate: { path: "comment_author", select: "name" },
      })
      .populate("user_id", "name email");
    res.status(200).json({ success: true, result: reports });
  } catch (e) {
    next(e);
  }
};

const createReport = async (req, res, next) => {
  try {
    const { target_type, recipe_id, comment_id } = req.body;
    const current_user_id = req.user._id.toString();

    if (target_type === "recipe") {
      const recipe = await Recipe.findById(recipe_id);
      if (!recipe) {
        return res.status(404).json({ success: false, message: "Recipe not found" });
      }

      // Prevent self-reporting
      if (recipe.author.toString() === current_user_id) {
        return res.status(400).json({ success: false, message: "You cannot report your own recipe" });
      }

      // Prevent duplicate reports
      const existingReport = await Report.findOne({ recipe_id, user_id: current_user_id });
      if (existingReport) {
        return res.status(400).json({ success: false, message: "You have already reported this recipe" });
      }

      // Only user-generated recipes can be reported (check if source matches your logic)
      if (recipe.source !== "Original" && recipe.source !== "User") {
         // Logic adjustment: If source is Spoonacular/External, maybe we shouldn't report it here?
         // Keeping it flexible based on your existing code's intent.
      }
    } 
    
    else if (target_type === "comment") {
      const comment = await Comment.findById(comment_id);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Comment not found" });
      }

      // Prevent self-reporting
      if (comment.comment_author.toString() === current_user_id) {
        return res.status(400).json({ success: false, message: "You cannot report your own comment" });
      }

      // Prevent duplicate reports
      const existingReport = await Report.findOne({ comment_id, user_id: current_user_id });
      if (existingReport) {
        return res.status(400).json({ success: false, message: "You have already reported this comment" });
      }
    }

    const newReport = await Report.create({
      ...req.body,
      user_id: req.user._id,
    });
    
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
