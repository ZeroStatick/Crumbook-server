const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    sort: {
      type: String,
      required: true,
      enum: [
        "spam",
        "harassment",
        "hate_speech",
        "inappropriate_content",
        "copyright_infringement",
        "dangerous_content",
        "off_topic",
        "other",
      ],
    },
    reason: {
      type: String,
      trim: true,
      maxlength: [500, "Reason cannot be more than 500 characters"],
    },
    target_type: {
      type: String,
      required: true,
      enum: ["recipe", "comment"],
    },
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: function() { return this.target_type === "recipe"; }
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: function() { return this.target_type === "comment"; }
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Matching your "user" model name
      required: true,
    },
  },
  { timestamps: true },
);

const Report = mongoose.model("report", reportSchema);

module.exports = Report;
