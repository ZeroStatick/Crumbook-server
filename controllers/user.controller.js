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
    console.log("Update User Request - Body:", req.body);
    console.log("Update User Request - File:", req.file);
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdminOrOwner = req.user.role > 1; // Roles 2 (admin) and 3 (owner)

    if (!isSelf && !isAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only update your own profile or you must be an admin.",
      });
    }

    // SECURITY: Only an owner (role 3) can change user roles.
    if (req.body.role !== undefined && req.user.role !== 3) {
      delete req.body.role;
    }

    if (req.file) {
      // Robustly handle different properties where the URL might be stored
      req.body.profile_picture = req.file.path || req.file.url || req.file.secure_url;
    } else if (req.body.profile_picture === "") {
      // If the user didn't upload a new file and the client sent an empty string,
      // it might mean they want to remove the picture, but usually we want to keep it
      // unless specifically asked. Let's only remove it if it's explicitly set to null/empty
      // but if it's already empty, we can just delete it from req.body to avoid overwriting with empty
      delete req.body.profile_picture;
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
