const { z } = require("zod");

const reportSorts = [
  "spam", // Commercial ads or repetitive content
  "harassment", // Bullying or personal attacks in comments
  "hate_speech", // Discriminatory content
  "inappropriate_content", // Nudity or graphic violence
  "copyright_infringement", // Stolen recipe or photo from another site
  "dangerous_content", // Misleading health advice or toxic ingredients
  "off_topic", // Not a recipe (e.g., a meme or personal photo)
  "other", // Anything else (requires details),
];

const reportSchema = z.object({
  body: z.object({
    sort: z.enum(reportSorts),
    reason: z.string().max(500).optional().or(z.literal("")),
    recipe_id: z.string(),
  }),
});

module.exports = reportSchema;
