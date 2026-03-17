const Recipe = require("../models/recipe.model");

const createRecipe = async (req, res, next) => {
  try {
    // Attach the currently logged-in user's ID as the author
    const newRecipe = new Recipe({
      ...req.body,
      author: req.user._id,
    });

    await newRecipe.save();
    res.status(201).json({ success: true, result: newRecipe });
  } catch (error) {
    next(error);
  }
};

const getAllRecipes = async (req, res, next) => {
  try {
    // Populate allows us to fetch the author's details (like name) instead of just their ID
    const recipes = await Recipe.find().populate("author", "name email");
    res.status(200).json({ success: true, result: recipes });
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "name email",
    );
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
    const isAuthor = recipe.author.toString() === req.user._id;
    const isAdminOrOwner = req.user.role > 1; // Roles 2 (admin) and 3 (owner)

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
    const isAuthor = recipe.author.toString() === req.user._id;
    const isAdminOrOwner = req.user.role > 1;

    if (!isAuthor && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only delete your own recipes or you must be an admin.",
      });
    }

    await recipe.deleteOne();
    res.status(200).json({ success: true, result: { message: "Recipe deleted successfully" } });
  } catch (error) {
    next(error);
  }
};

const getRecipesByAuthor = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.params.authorId });
    res.status(200).json({ success: true, result: recipes });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getRecipesByAuthor,
};

