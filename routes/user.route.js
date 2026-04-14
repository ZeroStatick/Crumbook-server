const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller.js");
const { auth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const {
  updateUserSchema,
  userIdSchema,
} = require("../validations/user.validation.js");

router.get("/me", auth, userController.getMe);
router.post("/favorites", auth, userController.toggleFavorite);
router.get("/:id", auth, validate(userIdSchema), userController.getUser);
router.put("/:id", auth, validate(updateUserSchema), userController.updateUser);
router.get("/", auth, userController.getAllUsers);
router.delete("/:id", auth, validate(userIdSchema), userController.deleteUser);

module.exports = router;
