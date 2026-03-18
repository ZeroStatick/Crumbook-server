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
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          enum: [
            "g", // gram
            "kg", // kilogram
            "ml", // milliliter
            "cl", // centiliter
            "l", // liter
            "tsp", // teaspoon (cuillère à café)
            "tbsp", // tablespoon (cuillère à soupe)
            "cup", // cup (tasse)
            "piece", // unit / piece (unité)
            "pinch", // pinch (pincée)
            "slice", // slice (tranche)
            "clove", // clove (gousse - ex: ail)
            "sprig", // sprig (brin - ex: thym)
            "handful", // handful (poignée)
            "to taste", // à votre convenance (sel/poivre)
          ],
          required: true,
        },
      },
    ],
    instructions: {
      type: [String],
      maxlength: [100, "Each instruction cannot be more than X character"],
      required: [true, "A recipe must have instructions"],
    },
    image: {
      type: String, // URL to the image
    },
    prepTime: Number, // Time in minutes
    cookTime: Number, // Time in minutes
    servings: Number,
    difficulty: String,
    tags: [String],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    original_author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      immutable: true,
    },
    original_recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
      required: true,
      immutable: true,
    },
    source: { type: String, required: true },
    public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
