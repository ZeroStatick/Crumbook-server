const Recipe = require("../models/recipe.model.js");

const createRecipe = async (req, res, next) => {
  try {
    const recipeData = { ...req.body };

    // Attach the currently logged-in user's ID as the author
    recipeData.author = req.user._id;

    // If it's a new recipe (not a fork), set original_author to current user
    if (!recipeData.original_author) {
      recipeData.original_author = req.user._id;
    }

    const newRecipe = new Recipe(recipeData);

    // If it's a new recipe, it is its own original
    if (!recipeData.original_recipe) {
      newRecipe.original_recipe = newRecipe._id;
    }

    await newRecipe.save();
    res.status(201).json({ success: true, result: newRecipe });
  } catch (error) {
    next(error);
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    // Populate allows us to fetch the author's details and the ingredient details
    const recipes = await Recipe.find()
      .populate("author", "name email")
      .populate("ingredients.item");
    res.status(200).json({ success: true, result: recipes });
  } catch (error) {
    next(error);
  }
};

const getRecipeByIngredients = async (req, res, next) => {
  try {
    const { ingredients } = req.query;

    if (!ingredients) {
      return res
        .status(400)
        .json({ success: false, message: "No ingredients provided" });
    }

    const ingredientIds = ingredients.split(",");

    // Find recipes that contain ALL the provided ingredient IDs
    const recipes = await Recipe.find({
      "ingredients.item": { $all: ingredientIds },
    })
      .populate("author", "name email")
      .populate("ingredients.item");

    res.status(200).json({ success: true, result: recipes });
  } catch (error) {
    next(error);
  }
};

const getAllRecipesByUserId = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.params.id }).populate(
      "author",
      "name email",
    );
    res.status(200).json({ success: true, result: recipes });
  } catch (e) {
    next(e);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("author", "name email")
      .populate("ingredients.item");
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }
    res.status(200).json({ success: true, result: recipe });
  } catch (error) {
    next(error);
  }
};

const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Authorization: Ensure the user is the author or an admin/owner.
    const isAuthor = recipe.author.toString() === req.user._id.toString();
    const isAdminOrOwner = req.user.role >= 2; // Role 2 is admin, Role 3 is owner

    if (!isAuthor && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only update your own recipes or you must be an admin.",
      });
    }

    // SECURITY: Prevent the author field from being changed on update.
    if (req.body.author) {
      delete req.body.author;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("author", "name email"); // Populate author details in the response for consistency.

    res.status(200).json({ success: true, result: updatedRecipe });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res
        .status(404)
        .json({ success: false, message: "Recipe not found" });
    }

    // Authorization: Ensure the user is the author or an admin/owner.
    const isAuthor = recipe.author.toString() === req.user._id.toString();
    const isAdminOrOwner = req.user.role > 1;

    if (!isAuthor && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only delete your own recipes or you must be an admin.",
      });
    }

    await recipe.deleteOne();
    res.status(200).json({
      success: true,
      result: { message: "Recipe deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getAllRecipesByUserId,
  getRecipeByIngredients,
};
