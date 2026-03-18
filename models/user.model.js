const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profile_picture: {
      type: String,
      default: "nobody.png", // don't forget to change it
    },
    password: {
      type: String,
      required: true,
      select: false,
    }, // 1 is user, 2 is admin/moderator, 3 is owners/devs
    role: {
      type: Number,
      default: 1,
    },
    googleId: {
      type: String,
      select: false,
    },
  },

  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
