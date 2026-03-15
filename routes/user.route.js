const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../middleware/auth.middleware");

router.get("/user/:id", auth, userController.getUser);
router.put("/user/:id", auth, userController.updateUser);
router.get("/users", auth, userController.getAllUsers);
router.delete("/user/:id", auth, userController.deleteUser);

module.exports = router;
