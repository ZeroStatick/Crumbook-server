const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const existing = await user.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });
  }
  const newUser = await user.create(req.body);
  res.status(201).json({ user: newUser });
};

exports.login = async (req, res, next) => {
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
  res.json({ user: foundUser.toJSON(), token: "Bearer " + token });
};
