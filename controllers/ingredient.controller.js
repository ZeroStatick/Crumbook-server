const Ingredient = require("../models/ingredient.model.js");

const addIngredient = async (req, res) => {
  try {
    const newIngredient = await Ingredient.create(req.body);

    res.status(201).json({
      success: true,
      data: newIngredient,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This ingredient already exists in the database.",
      });
    }
    res.status(500).json({ success: false, message: e.message });
  }
};

const getAllIngredients = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    const ingredients = await Ingredient.find(filter).sort({ name: 1 }); // Trié par ordre alphabétique

    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    res.status(200).json({ success: true, data: ingredient });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedIngredient) {
      return res
        .status(404)
        .json({ success: false, message: "Ingredient not found" });
    }

    res.status(200).json({ success: true, data: updatedIngredient });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ success: false, message: "Ingredient not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Ingredient deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

module.exports = {
  addIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
};
