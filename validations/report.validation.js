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
      reason: z.string().max(500).optional().or(z.literal("")),
      target_type: z.enum(["recipe", "comment", "guide", "guide_comment"]),
      recipe_id: z.string().optional(),
      comment_id: z.string().optional(),
      guide_id: z.string().optional(),
      guide_comment_id: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.target_type === "recipe") return !!data.recipe_id;
        if (data.target_type === "comment") return !!data.comment_id;
        if (data.target_type === "guide") return !!data.guide_id;
        if (data.target_type === "guide_comment") return !!data.guide_comment_id;
        return false;
      },
      {
        message:
          "Must provide recipe_id, comment_id, guide_id, or guide_comment_id depending on target_type",
        path: ["recipe_id", "comment_id", "guide_id", "guide_comment_id"],
      },
    ),
});

module.exports = { createReportSchema };
