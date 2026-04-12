const SPNCLR_URL_BY_INGR = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=";

/**
 * Endpoint for full recipe information (includes summary, readyInMinutes, servings, etc.)
 * @param {number|string} id - Spoonacular Recipe ID
 */
const SPNCLR_URL_INFORMATION = (id) => `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false`;

module.exports = {
  SPNCLR_URL_BY_INGR,
  SPNCLR_URL_INFORMATION
};
