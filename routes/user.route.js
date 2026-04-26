const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { auth, moderatorAndOwnerAuth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const {
  updateUserSchema,
  userIdSchema,
} = require("../validations/user.validation.js");

// Public route to view user profiles
router.get("/:id", validate(userIdSchema), userController.getUser);

// All subsequent user routes require authentication
router.use(auth);

router.get("/me", userController.getMe);
router.post("/favorites", userController.toggleFavorite);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.get("/", moderatorAndOwnerAuth, userController.getAllUsers);
router.delete("/:id", validate(userIdSchema), userController.deleteUser);

module.exports = router;
