const fetch = global.fetch || require("node-fetch");
const { SPNCLR_URL_BY_INGR, SPNCLR_URL_INFORMATION } = require("../constants/spoonacular.endpoints.js");

// Get the API key from environment variables
const apiKey = process.env.INGREDIENTS_API || process.env.SPNCLR_API;

if (!apiKey) {
  console.warn("⚠️ Warning: Spoonacular API key (INGREDIENTS_API or SPNCLR_API) is not set in environment.");
}

/**
 * Searches for recipes by a list of ingredients.
 * @param {string[]} ingredients - Array of ingredient names.
 * @param {number} number - Number of results to return (default 10).
 */
const searchByIngredients = async (ingredients, number = 10) => {
  if (!ingredients || ingredients.length === 0) return [];
  
  // Spoonacular expects ingredients separated by ','
  const ingredientsQuery = ingredients.join(",");
  const url = `${SPNCLR_URL_BY_INGR}${ingredientsQuery}&number=${number}&apiKey=${apiKey}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Spoonacular API error: ${response.status} - ${errorBody}`);
  }

  return await response.json();
};

/**
 * Fetches FULL details for a specific recipe (summary, time, servings, etc.)
 * @param {number|string} recipeId - Spoonacular recipe ID.
 */
const getRecipeDetails = async (recipeId) => {
  const url = `${SPNCLR_URL_INFORMATION(recipeId)}&apiKey=${apiKey}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Spoonacular API error: ${response.status}`);
  }

  return await response.json();
};

module.exports = {
  searchByIngredients,
  getRecipeDetails
};
