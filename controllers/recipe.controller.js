const Recipe = require("../models/recipe.model.js");
const Ingredient = require("../models/ingredient.model.js");
const Report = require("../models/report.model.js");
const spoonacularService = require("../services/spoonacular.service.js");
const {
  SPNCLR_URL_BY_INGR,
  SPNCLR_URL_INFORMATION,
} = require("../constants/spoonacular.endpoints.js");

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

    // 1. Fetch the names of these ingredients from our DB (needed for Spoonacular)
    const ingredientDocs = await Ingredient.find({ _id: { $in: ingredientIds } });
    const ingredientNames = ingredientDocs.map((doc) => doc.name);

    // 2. Search local database for recipes containing ALL these ingredient IDs
    const localRecipesRaw = await Recipe.find({
      "ingredients.item": { $all: ingredientIds },
    })
      .populate("author", "name email")
      .populate("ingredients.item");

    // 3. Search Spoonacular API
    let externalRecipesRaw = [];
    try {
      externalRecipesRaw = await spoonacularService.searchByIngredients(
        ingredientNames,
      );
    } catch (apiError) {
      console.error("Spoonacular API Error:", apiError.message);
      // We don't want to crash if the external API is down, just continue with local results
    }

    // 4. Normalize Local Recipes
    const localRecipes = localRecipesRaw.map((recipe) => ({
      _id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      source: recipe.author?.name || "User",
      isExternal: false,
    }));

    // 5. Normalize External Recipes (Spoonacular)
    const externalRecipes = externalRecipesRaw.map((recipe) => ({
      _id: `ext_${recipe.id}`, // Prefix to distinguish from MongoDB IDs
      title: recipe.title,
      // searchByIngredients doesn't give a description, so we create one
      description: `A delicious recipe using ${recipe.usedIngredients
        .map((i) => i.name)
        .join(", ")}.`,
      image: recipe.image,
      prepTime: 0, // Not provided in basic search
      cookTime: 0, // Not provided in basic search
      servings: 0,
      difficulty: null,
      source: "Spoonacular",
      isExternal: true,
      externalId: recipe.id,
    }));

    // 6. Combine and return
    const result = [...localRecipes, ...externalRecipes];

    res.status(200).json({ success: true, result });
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
    const { id } = req.params;

    // Check if it's an external recipe
    if (id.startsWith("ext_")) {
      const spoonacularId = id.replace("ext_", "");
      const rawRecipe = await spoonacularService.getRecipeDetails(spoonacularId);

      // Normalize Spoonacular full details to match our internal structure
      const normalizedRecipe = {
        _id: id,
        title: rawRecipe.title,
        // Spoonacular summary often contains HTML tags
        description: rawRecipe.summary ? rawRecipe.summary.replace(/<[^>]*>?/gm, "") : "",
        image: rawRecipe.image,
        prepTime: rawRecipe.readyInMinutes,
        cookTime: 0,
        servings: rawRecipe.servings,
        difficulty: null,
        source: "Spoonacular",
        isExternal: true,
        ingredients: rawRecipe.extendedIngredients.map((ing) => ({
          item: { name: ing.name, image: ing.image },
          quantity: ing.amount,
          unit: ing.unit,
        })),
        instructions: rawRecipe.analyzedInstructions?.[0]?.steps.map((s) => s.step) || [],
        author: { name: "Spoonacular" },
        original_recipe: id,
      };

      return res.status(200).json({ success: true, result: normalizedRecipe });
    }

    // Otherwise, handle internal MongoDB recipe
    const recipe = await Recipe.findById(id)
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
    // Also delete all reports associated with this recipe
    await Report.deleteMany({ recipe_id: req.params.id });

    res.status(200).json({
      success: true,
      result: { message: "Recipe and associated reports deleted successfully" },
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
