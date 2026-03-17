const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    // The check for an existing email is removed because the unique index on the
    // User model and the global error handler already manage this. This keeps the controller cleaner.
    const newUser = await user.create(req.body);
    newUser.password = undefined;

    res.status(201).json({ success: true, result: newUser });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const foundUser = await user
      .findOne({ email: req.body.email.toLowerCase() })
      .select("+password");
    if (!foundUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(req.body.password, foundUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { _id: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    foundUser.password = undefined;

    res.json({
      success: true,
      result: { user: foundUser.toJSON(), token: "Bearer " + token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
