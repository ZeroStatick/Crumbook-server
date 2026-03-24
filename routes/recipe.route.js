const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller.js");
const { auth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const {
  createRecipeSchema,
  updateRecipeSchema,
  recipeIdSchema,
  getRecipesByIngredientsSchema,
} = require("../validations/recipe.validation.js");

// Public routes
router.get("/", recipeController.getAllRecipes);
router.get(
  "/ingredients",
  validate(getRecipesByIngredientsSchema),
  recipeController.getRecipeByIngredients,
);
router.get("/:id", validate(recipeIdSchema), recipeController.getRecipeById);
router.get("/user/:id", validate(recipeIdSchema), recipeController.getAllRecipesByUserId);

// Protected routes (require valid JWT)
router.post(
  "/",
  auth,
  validate(createRecipeSchema),
  recipeController.createRecipe,
);
router.put(
  "/:id",
  auth,
  validate(updateRecipeSchema),
  recipeController.updateRecipe,
);
router.delete(
  "/:id",
  auth,
  validate(recipeIdSchema),
  recipeController.deleteRecipe,
);

module.exports = router;
