const { z } = require("zod");

const ingredientCategories = [
  "vegetable",
  "fruit",
  "meat",
  "fish",
  "seafood",
  "dairy",
  "spice",
  "herb",
  "grain",
  "legume",
  "oil",
  "sweetener",
  "bakery",
  "other",
];

/**
 * Zod schema for creating an ingredient.
 */
const createIngredientSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Ingredient name is required").trim().toLowerCase(),
    category: z.enum(ingredientCategories).optional().default("other"),
    image: z.string().optional(),
    caloriesPer100g: z.number().nonnegative().optional().default(0),
  }).strict(),
});

/**
 * Zod schema for updating an ingredient.
 */
const updateIngredientSchema = z.object({
  body: z.object({
    name: z.string().min(1).trim().toLowerCase().optional(),
    category: z.enum(ingredientCategories).optional(),
    image: z.string().optional(),
    caloriesPer100g: z.number().nonnegative().optional(),
  }).strict(),
  params: z.object({
    id: z.string().min(1, "Ingredient ID is required"),
  }),
});

/**
 * Zod schema for simple ID parameter validation.
 */
const ingredientIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Ingredient ID is required"),
  }),
});

module.exports = {
  createIngredientSchema,
  updateIngredientSchema,
  ingredientIdSchema,
};
