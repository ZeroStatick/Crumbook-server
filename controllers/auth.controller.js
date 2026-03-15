const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const existing = await user.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }
    const newUser = await user.create(req.body);
    newUser.password = undefined;

    res.status(201).json({ success: true, result: newUser });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
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
