const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller.js");
const { auth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const {
  createCommentSchema,
  updateCommentSchema,
  commentIdSchema,
  recipeIdSchema,
} = require("../validations/comment.validation.js");

// Public routes
router.get(
  "/recipe/:recipeId",
  validate(recipeIdSchema),
  commentController.getCommentsByRecipe,
);

// Protected routes
router.post(
  "/",
  auth,
  validate(createCommentSchema),
  commentController.createComment,
);

router.put(
  "/:id",
  auth,
  validate(updateCommentSchema),
  commentController.updateComment,
);

router.delete(
  "/:id",
  auth,
  validate(commentIdSchema),
  commentController.deleteComment,
);

module.exports = router;
