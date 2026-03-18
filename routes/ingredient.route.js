const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller.js");
const { moderatorAndOwnerAuth } = require("../middleware/auth.middleware.js");

// Public routes
router.get("/", ingredientController.getAllIngredients);
router.get("/:id", ingredientController.getIngredientById);

// Protected routes (require valid JWT)
router.post("/", moderatorAndOwnerAuth, ingredientController.addIngredient);
router.put(
  "/:id",
  moderatorAndOwnerAuth,
  ingredientController.updateIngredient,
);
router.delete(
  "/:id",
  moderatorAndOwnerAuth,
  ingredientController.deleteIngredient,
);
