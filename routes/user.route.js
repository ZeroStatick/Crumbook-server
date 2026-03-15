const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middleware");

router.get("/:id", auth, userController.getUser);
router.put("/:id", auth, userController.updateUser);
router.get("/", auth, userController.getAllUsers);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
