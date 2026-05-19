const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Recipe = require("../models/recipe.model.js");
const Comment = require("../models/comment.model.js");
const Guide = require("../models/guide.model.js");
const GuideComment = require("../models/guideComment.model.js");
const Report = require("../models/report.model.js");

const getUser = async (req, res, next) => {
  try {
    // SECURITY: Only project safe, public fields to prevent leaking emails or roles.
    const foundUser = await User.findById(req.params.id, { 
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

    const foundUser = await User.findById(req.params.id).select("+password");
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
    } else if (req.body.profile_picture && /^https?:\/\//i.test(req.body.profile_picture)) {
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
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ success: true, result: users });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const isSelf = req.user._id.toString() === req.params.id;
    const isAdminOrOwner = req.user.role > 1;

    if (!isSelf && !isAdminOrOwner) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You can only delete your own profile or you must be an admin.",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id).session(session);
    if (!deletedUser) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Recursive Purge: Delete all content authored by this user
    const recipes = await Recipe.find({ author: req.params.id }).select("_id").session(session);
    const recipeIds = recipes.map(r => r._id);
    
    const comments = await Comment.find({ comment_author: req.params.id }).select("_id").session(session);
    const commentIds = comments.map(c => c._id);
    
    const guides = await Guide.find({ authorId: req.params.id }).select("_id").session(session);
    const guideIds = guides.map(g => g._id);
    
    const guideComments = await GuideComment.find({ comment_author: req.params.id }).select("_id").session(session);
    const guideCommentIds = guideComments.map(gc => gc._id);

    // Delete Content
    await Recipe.deleteMany({ author: req.params.id }).session(session);
    await Comment.deleteMany({ comment_author: req.params.id }).session(session);
    await Guide.deleteMany({ authorId: req.params.id }).session(session);
    await GuideComment.deleteMany({ comment_author: req.params.id }).session(session);

    // Purge Reports associated with the user OR their content
    await Report.deleteMany({
      $or: [
        { user_id: req.params.id }, // Reports MADE by the user
        { recipe_id: { $in: recipeIds } },
        { comment_id: { $in: commentIds } },
        { guide_id: { $in: guideIds } },
        { guide_comment_id: { $in: guideCommentIds } }
      ]
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      result: { message: "User and all associated data purged successfully" },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const foundUser = await User.findById(req.user._id, { password: 0 });
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

    const foundUser = await User.findById(userId);
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
    
    const updatedUser = await User.findById(userId, { password: 0 });
    res.status(200).json({ success: true, result: updatedUser });
  } catch (error) {
    next(error);
  }
};

const syncFavorites = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { recipeIds } = req.body;

    if (!Array.isArray(recipeIds)) {
      return res.status(400).json({ success: false, message: "recipeIds must be an array" });
    }

    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Merge unique favorites
    const currentFavs = foundUser.favorites.map(id => id.toString());
    const newFavs = [...new Set([...currentFavs, ...recipeIds])];
    
    foundUser.favorites = newFavs;
    await foundUser.save();

    const updatedUser = await User.findById(userId, { password: 0 });
    res.status(200).json({ success: true, result: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, updateUser, getAllUsers, deleteUser, getMe, toggleFavorite, syncFavorites };
