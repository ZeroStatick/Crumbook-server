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

module.exports = {
  updateUserSchema,
  userIdSchema,
};
