const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller.js");
const { auth } = require("../middleware/auth.middleware.js");

// Public routes (e.g., GET /api/recipes, GET /api/recipes/:id)
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);
router.get("/author/:authorId", recipeController.getRecipesByAuthor);
router.get("/user/:id", recipeController.getAllRecipesByUserId);

// Protected routes (require valid JWT) (e.g., POST /api/recipes, PUT /api/recipes/:id)
router.post("/", auth, recipeController.createRecipe);
router.put("/:id", auth, recipeController.updateRecipe);
router.delete("/:id", auth, recipeController.deleteRecipe);

module.exports = router;
