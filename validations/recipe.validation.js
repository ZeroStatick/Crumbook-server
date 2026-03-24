const { z } = require("zod");

const recipeUnits = [
  "g", "kg", "ml", "cl", "l", "tsp", "tbsp", "cup",
  "piece", "pinch", "slice", "clove", "sprig", "handful", "to taste"
];

/**
 * Zod schema for creating a recipe.
 */
const createRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Recipe title is required").max(100),
    description: z.string().max(500).optional(),
    ingredients: z.array(z.object({
      item: z.string().min(1, "Ingredient ID is required"),
      quantity: z.number().positive("Quantity must be a positive number"),
      unit: z.enum(recipeUnits),
    })).min(1, "At least one ingredient is required"),
    instructions: z.array(z.string().min(1)).min(1, "At least one instruction is required"),
    image: z.string().optional(),
    prepTime: z.number().nonnegative().optional(),
    cookTime: z.number().nonnegative().optional(),
    servings: z.number().positive().optional(),
    difficulty: z.string().optional(),
    tags: z.array(z.string()).optional(),
    public: z.boolean().optional().default(true),
    source: z.string().min(1, "Source is required"),
    original_recipe: z.string().optional(),
    original_author: z.string().optional(),
  }),
});

/**
 * Zod schema for updating a recipe.
 */
const updateRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    ingredients: z.array(z.object({
      item: z.string().min(1),
      quantity: z.number().positive(),
      unit: z.enum(recipeUnits),
    })).optional(),
    instructions: z.array(z.string().min(1)).optional(),
    image: z.string().optional(),
    prepTime: z.number().nonnegative().optional(),
    cookTime: z.number().nonnegative().optional(),
    servings: z.number().positive().optional(),
    difficulty: z.string().optional(),
    tags: z.array(z.string()).optional(),
    public: z.boolean().optional(),
  }).strict(),
  params: z.object({
    id: z.string().min(1, "Recipe ID is required"),
  }),
});

/**
 * Zod schema for simple ID parameter validation.
 */
const recipeIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Recipe ID is required"),
  }),
});

/**
 * Zod schema for filtering recipes by ingredients.
 */
const getRecipesByIngredientsSchema = z.object({
  query: z.object({
    ingredients: z.string().min(1, "At least one ingredient ID is required"),
  }),
});

module.exports = {
  createRecipeSchema,
  updateRecipeSchema,
  recipeIdSchema,
  getRecipesByIngredientsSchema,
};
