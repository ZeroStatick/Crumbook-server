const { z } = require("zod");

/**
 * Zod schema for user registration.
 * It enforces constraints for email format and minimum password length.
 */
const registerSchema = z.object({
  body: z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters long"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      role: z.number().optional().default(1),
    })
    .strict(),
});

/**
 * Zod schema for user login.
 */
const loginSchema = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
