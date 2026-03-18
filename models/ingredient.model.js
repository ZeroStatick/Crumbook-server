const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        "vegetable",
        "fruit",
        "meat",
        "fish",
        "seafood",
        "dairy",
        "spice",
        "herb",
        "grain",
        "legume",
        "oil",
        "sweetener",
        "bakery",
        "other",
      ],
      default: "other",
    },
    image: {
      type: String,
      default: "default-ingredient.png",
    },
    caloriesPer100g: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
