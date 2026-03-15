const user = require("../models/user.model");

const getUser = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.user._id, { password: 0 });
    if (!foundUser) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ user: foundUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await user
      .findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
        context: "query",
      })
      .select("-password");
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await user.find({}, { password: 0 });
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, updateUser, getAllUsers, deleteUser };
