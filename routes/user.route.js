const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const upload = require("../config/cloudinary.js");
const {
  auth,
  moderatorAndOwnerAuth,
} = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const {
  updateUserSchema,
  userIdSchema,
  toggleFavoriteSchema,
} = require("../validations/user.validation.js");

// Specific routes should come before parameterized routes to avoid collision.
// Get current user data (requires authentication)
router.get("/me", auth, userController.getMe);
// Public route to view user profiles
router.get("/:id", validate(userIdSchema), userController.getUser);

// All subsequent user routes require authentication
router.use(auth);

// router.get("/me", userController.getMe);
router.post(
  "/favorites",
  validate(toggleFavoriteSchema),
  userController.toggleFavorite,
);
// router.get("/:id", validate(userIdSchema), userController.getUser);
router.put(
  "/:id",
  upload.single("profile_picture"),
  validate(updateUserSchema),
  userController.updateUser,
);
router.get("/", moderatorAndOwnerAuth, userController.getAllUsers);
router.delete("/:id", validate(userIdSchema), userController.deleteUser);

module.exports = router;
