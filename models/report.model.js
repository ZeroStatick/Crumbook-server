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
      enum: ["recipe", "comment", "guide", "guide_comment"],
    },
    recipe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: function () {
        return this.target_type === "recipe";
      },
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: function () {
        return this.target_type === "comment";
      },
    },
    guide_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuideComment",
      required: function () {
        return this.target_type === "guide_comment";
      },
    },
    guide_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      required: function () {
        return this.target_type === "guide";
      },
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
