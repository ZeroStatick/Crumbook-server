const { z } = require("zod");

const createCommentSchema = z.object({
  body: z.object({
    text: z.string().max(500, "Comment can't be more than 500 characters").optional(),
    rating: z.number().min(1).max(5),
    commented_recipe: z.string().min(1, "Recipe ID is required"),
  }),
});

const updateCommentSchema = z.object({
  body: z.object({
    text: z.string().max(500, "Comment can't be more than 500 characters").optional(),
    rating: z.number().min(1).max(5).optional(),
  }).strict(),
  params: z.object({
    id: z.string().min(1, "Comment ID is required"),
  }),
});

const commentIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Comment ID is required"),
  }),
});

const recipeIdSchema = z.object({
  params: z.object({
    recipeId: z.string().min(1, "Recipe ID is required"),
  }),
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
  commentIdSchema,
  recipeIdSchema,
};
