const Report = require("../models/report.model.js");
const Recipe = require("../models/recipe.model.js");

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
    const recipe = await Recipe.findById(req.body.recipe_id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // 1. Prevent self-reporting
    if (recipe.author.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: "You cannot report your own recipe" 
      });
    }

    // 2. Prevent duplicate reports from the same user
    const existingReport = await Report.findOne({
      recipe_id: req.body.recipe_id,
      user_id: req.user._id,
    });

    if (existingReport) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reported this recipe" 
      });
    }

    // Flexible source check (allow null/undefined as Original)
    if (recipe.source && recipe.source !== "Original") {
      return res.status(400).json({ success: false, message: "Only user-generated recipes can be reported" });
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
