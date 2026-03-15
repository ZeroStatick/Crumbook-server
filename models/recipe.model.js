const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A recipe must have a title"],
      trim: true,
      maxlength: [100, "A recipe title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    ingredients: [
      {
        name: { type: String, required: true, trim: true },
        quantity: { type: String, required: true, trim: true },
      },
    ],
    instructions: {
      type: String,
      required: [true, "A recipe must have instructions"],
    },
    image: {
      type: String, // URL to the image
    },
    prepTime: Number, // Time in minutes
    cookTime: Number, // Time in minutes
    servings: Number,
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
