const user = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    req.body.email = req.body.email.toLowerCase();
    const newUser = await user.create(req.body);
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({ success: true, result: userResponse });
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

module.exports = { login, register };
