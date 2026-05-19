const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// v2.2.1 uses direct properties, but can accept functions for dynamic values
const storage = CloudinaryStorage({
  cloudinary: { v2: cloudinary },
  folder: (req, file, cb) => {
    try {
      const folder = file?.fieldname === "profile_picture" ? "crumbook_profiles" : "crumbook";
      cb(null, folder);
    } catch (err) {
      cb(err);
    }
  },
  allowedFormats: ["jpg", "png", "jpeg", "webp"],
  transformation: [{ width: 1280, height: 720, crop: "limit", quality: "auto" }],
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
