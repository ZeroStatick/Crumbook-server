const { API_call } = require("./api.api.js");

const getAllRecipes = () => API_call("/api/recipes");

const getRecipeById = (recipeId) => API_call(`/api/recipes/${recipeId}`);

const getRecipesByAuthor = (authorId) =>
  API_call(`/api/recipes/author/${authorId}`);

const createRecipe = (recipeData) =>
  API_call("/api/recipes", "POST", recipeData);

const updateRecipe = (recipeId, recipeData) =>
  API_call(`/api/recipes/${recipeId}`, "PUT", recipeData);

const deleteRecipe = (recipeId) => API_call(`/api/recipes/${recipeId}`, "DELETE");

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipesByAuthor,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
