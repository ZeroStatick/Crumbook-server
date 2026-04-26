const mongoose = require("mongoose");

const maxCommentLength = 500;

const commentSchema = new mongoose.Schema(
  {
    comment_author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxlength: [maxCommentLength, "Comment can't be more than 500 characters"],
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    commented_recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    commented_recipe_author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
