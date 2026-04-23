const Comment = require("../models/comment.model.js");
const Recipe = require("../models/recipe.model.js");

const createComment = async (req, res, next) => {
  try {
    const { text, rating, commented_recipe } = req.body;
    const comment_author = req.user._id;

    const recipe = await Recipe.findById(commented_recipe);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const newComment = new Comment({
      text,
      rating,
      commented_recipe,
      comment_author,
      commented_recipe_author: recipe.author,
    });

    await newComment.save();
    res.status(201).json({ success: true, result: newComment });
  } catch (error) {
    next(error);
  }
};

const getCommentsByRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const comments = await Comment.find({ commented_recipe: recipeId })
      .populate("comment_author", "name image")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, result: comments });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, rating } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.comment_author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You can only update your own comments" });
    }

    comment.text = text || comment.text;
    comment.rating = rating !== undefined ? rating : comment.rating;

    await comment.save();
    res.status(200).json({ success: true, result: comment });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const isAuthor = comment.comment_author.toString() === req.user._id.toString();
    const isAdminOrOwner = req.user.role > 1;

    if (!isAuthor && !isAdminOrOwner) {
      return res.status(403).json({ success: false, message: "Forbidden: You can only delete your own comments or you must be an admin" });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, result: { message: "Comment deleted successfully" } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByRecipe,
  updateComment,
  deleteComment,
};
