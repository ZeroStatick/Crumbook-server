const Ingredient = require("../models/ingredient.model.js");

const addIngredient = async (req, res, next) => {
  try {
    const newIngredient = await Ingredient.create(req.body);

    res.status(201).json({
      success: true,
      result: newIngredient,
    });
  } catch (e) {
    next(e);
  }
};

const getAllIngredients = async (req, res, next) => {
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
      result: ingredients,
    });
  } catch (e) {
    next(e);
  }
};

const getIngredientById = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    res.status(200).json({ success: true, result: ingredient });
  } catch (e) {
    next(e);
  }
};

const updateIngredient = async (req, res, next) => {
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

    res.status(200).json({ success: true, result: updatedIngredient });
  } catch (e) {
    next(e);
  }
};

const deleteIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res
        .status(404)
        .json({ success: false, message: "Ingredient not found" });
    }

    res
      .status(200)
      .json({ success: true, result: { message: "Ingredient deleted successfully" } });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
};
