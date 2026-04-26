const { z } = require("zod");

const reportSorts = [
  "spam",
  "harassment",
  "hate_speech",
  "inappropriate_content",
  "copyright_infringement",
  "dangerous_content",
  "off_topic",
  "other",
];

const createReportSchema = z.object({
  body: z
    .object({
      sort: z.enum(reportSorts),
      reason: z.string().min(1).max(500),
      target_type: z.enum(["recipe", "comment"]),
      recipe_id: z.string().optional(),
      comment_id: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.target_type === "recipe") return !!data.recipe_id;
        if (data.target_type === "comment") return !!data.comment_id;
        return false;
      },
      {
        message:
          "Must provide recipe_id for recipe reports or comment_id for comment reports",
        path: ["recipe_id", "comment_id"],
      },
    ),
});

module.exports = { createReportSchema };
