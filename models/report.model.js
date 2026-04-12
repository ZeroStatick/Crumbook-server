const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    sort: {
      type: String,
      required: true,
      enum: [
        "spam", // Commercial ads or repetitive content
        "harassment", // Bullying or personal attacks in comments
        "hate_speech", // Discriminatory content
        "inappropriate_content", // Nudity or graphic violence
        "copyright_infringement", // Stolen recipe or photo from another site
        "dangerous_content", // Misleading health advice or toxic ingredients
        "off_topic", // Not a recipe (e.g., a meme or personal photo)
        "other", // Anything else (requires details),
      ],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [500, "Reason cannot be more than 500 characters"],
    },
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
