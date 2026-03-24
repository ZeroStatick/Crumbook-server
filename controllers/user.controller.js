const user = require("../models/user.model.js");

const getUser = async (req, res, next) => {
  try {
    const foundUser = await user.findById(req.params.id, { password: 0 });
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, result: foundUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdminOrOwner = req.user.role > 1; // Roles 2 (admin) and 3 (owner)

    if (!isSelf && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only update your own profile or you must be an admin.",
      });
    }

    // SECURITY: Prevent a non-admin user from changing their own role.
    if (req.body.role !== undefined && !isAdminOrOwner) {
      delete req.body.role;
    }

    const updatedUser = await user
      .findByIdAndUpdate(req.params.id, req.body, {
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
    res.status(200).json({ success: true, result: updatedUser });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await user.find({}, { password: 0 });
    res.status(200).json({ success: true, result: users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdminOrOwner = req.user.role > 1;

    if (!isSelf && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only delete your own profile or you must be an admin.",
      });
    }

    const deletedUser = await user.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      result: { message: "User deleted successfully" },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const foundUser = await user.findById(req.user._id, { password: 0 });
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, result: foundUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, updateUser, getAllUsers, deleteUser, getMe };
