const { z } = require("zod");

/**
 * Zod schema for updating a user profile.
 * All fields are optional since updates are usually partial.
 */
const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long").optional(),
    email: z.string().email("Invalid email address").optional(),
    profile_picture: z.string().optional().or(z.literal("")),
    role: z.number().min(1).max(3).optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
    currentPassword: z.string().optional(),
  }).strict(),
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

/**
 * Zod schema for simple ID parameter validation.
 */
const userIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

/**
 * Zod schema for toggling a favorite recipe.
 */
const toggleFavoriteSchema = z.object({
  body: z.object({
    recipeId: z.string().min(1, "Recipe ID is required"),
  }).strict(),
});

module.exports = {
  updateUserSchema,
  userIdSchema,
  toggleFavoriteSchema,
};
