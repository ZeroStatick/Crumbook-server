const Recipe = require("../models/recipe.model.js");

/**
 * Service to handle internal Recipe database operations.
 * Separates DB logic from controllers for reusability.
 */
class RecipeService {
  /**
   * Find internal recipes that contain ALL the provided ingredient IDs.
   * @param {string[]} ingredientIds - Array of MongoDB ObjectIDs for ingredients.
   * @returns {Promise<Array>} - List of internal recipes found.
   */
  async findByIngredients(ingredientIds) {
    if (!ingredientIds || ingredientIds.length === 0) return [];

    return await Recipe.find({
      "ingredients.item": { $all: ingredientIds },
      public: true, // Only show public recipes
    })
      .populate("author", "name email profile_picture")
      .populate("ingredients.item");
  }

  /**
   * Fetch a single recipe by ID with full details.
   * @param {string} recipeId - MongoDB ObjectID of the recipe.
   * @returns {Promise<Object>} - Detailed recipe object.
   */
  async getById(recipeId) {
    return await Recipe.findById(recipeId)
      .populate("author", "name email profile_picture")
      .populate("ingredients.item");
  }

  /**
   * List all public recipes.
   * @param {number} limit - Maximum number of recipes to return.
   * @returns {Promise<Array>} - List of public recipes.
   */
  async getAllPublic(limit = 20) {
    return await Recipe.find({ public: true })
      .limit(limit)
      .populate("author", "name email")
      .populate("ingredients.item");
  }
}

module.exports = new RecipeService();
