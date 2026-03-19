const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller.js");
const { moderatorAndOwnerAuth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const {
  createIngredientSchema,
  updateIngredientSchema,
  ingredientIdSchema,
} = require("../validations/ingredient.validation.js");

// Public routes
router.get("/", ingredientController.getAllIngredients);
router.get("/:id", validate(ingredientIdSchema), ingredientController.getIngredientById);

// Protected routes (require valid JWT)
router.post(
  "/",
  moderatorAndOwnerAuth,
  validate(createIngredientSchema),
  ingredientController.addIngredient,
);
router.put(
  "/:id",
  moderatorAndOwnerAuth,
  validate(updateIngredientSchema),
  ingredientController.updateIngredient,
);
router.delete(
  "/:id",
  moderatorAndOwnerAuth,
  validate(ingredientIdSchema),
  ingredientController.deleteIngredient,
);

module.exports = router;
