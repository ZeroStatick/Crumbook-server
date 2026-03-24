const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller.js");
const validate = require("../middleware/validate.js");
const { registerSchema, loginSchema } = require("../validations/auth.validation.js");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
