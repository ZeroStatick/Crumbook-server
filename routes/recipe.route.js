const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const { auth } = require("../middleware/auth.middleware");

// Public routes
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);

// Protected routes (require valid JWT)
router.post("/", auth, recipeController.createRecipe);
router.put("/:id", auth, recipeController.updateRecipe);
router.delete("/:id", auth, recipeController.deleteRecipe);

module.exports = router;
