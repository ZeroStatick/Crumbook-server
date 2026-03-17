const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { auth } = require("../middleware/auth.middleware");

// Public routes
router.get("/recipes", recipeController.getAllRecipes);
router.get("/recipe/:id", recipeController.getRecipeById);

// Protected routes (require valid JWT)
router.post("/recipes", auth, recipeController.createRecipe);
router.put("/recipe/:id", auth, recipeController.updateRecipe);
router.delete("/recipe/:id", auth, recipeController.deleteRecipe);

module.exports = router;
