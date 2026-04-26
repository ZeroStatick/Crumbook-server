const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config(); // Automatically uses CLOUDINARY_URL from process.env

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "crumbook_profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
