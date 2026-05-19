const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isAiGenerated: {
      type: Boolean,
      default: false,
    },
    isOfficialGuide: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Guide = mongoose.model("Guide", guideSchema);

module.exports = Guide;
