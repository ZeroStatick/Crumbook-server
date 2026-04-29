const user = require("../models/user.model.js");
const bcrypt = require("bcrypt");

const getUser = async (req, res, next) => {
  try {
    // SECURITY: Only project safe, public fields to prevent leaking emails or roles.
    const foundUser = await user.findById(req.params.id, { 
      name: 1, 
      profile_picture: 1, 
      createdAt: 1 
    });
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
    const isAdminOrOwner = req.user.role > 1;

    if (!isSelf && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile or you must be an admin.",
      });
    }

    const foundUser = await user.findById(req.params.id).select("+password");
    if (!foundUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Handle Password Change
    if (req.body.password) {
      if (!isSelf) {
        return res.status(403).json({ success: false, message: "Only the user can change their own password." });
      }
      if (!req.body.currentPassword) {
        return res.status(400).json({ success: false, message: "Current password is required to set a new password." });
      }
      const isMatch = await bcrypt.compare(req.body.currentPassword, foundUser.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Incorrect current password." });
      }
      foundUser.password = req.body.password;
    }

    // Update other fields
    if (req.body.name) foundUser.name = req.body.name;
    if (req.body.email) foundUser.email = req.body.email.toLowerCase();
    
    // Role update - Only owner (role 3) can change roles
    if (req.body.role !== undefined && req.user.role === 3) {
      foundUser.role = req.body.role;
    }

    if (req.file) {
      foundUser.profile_picture = req.file.path || req.file.url || req.file.secure_url;
    } else if (req.body.profile_picture === "") {
      foundUser.profile_picture = null; // Explicitly allow removal to show default avatar
    } else if (req.body.profile_picture) {
      foundUser.profile_picture = req.body.profile_picture;
    }

    await foundUser.save();
    
    // Return user without password
    const result = foundUser.toObject();
    delete result.password;

    res.status(200).json({ success: true, result });
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

const toggleFavorite = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeId } = req.body;

    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFavorite = foundUser.favorites.includes(recipeId);
    
    if (isFavorite) {
      foundUser.favorites = foundUser.favorites.filter(id => id.toString() !== recipeId);
    } else {
      foundUser.favorites.push(recipeId);
    }

    await foundUser.save();
    
    const updatedUser = await user.findById(userId, { password: 0 });
    res.status(200).json({ success: true, result: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, updateUser, getAllUsers, deleteUser, getMe, toggleFavorite };
