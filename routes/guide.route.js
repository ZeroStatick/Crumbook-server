const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guide.controller");
const upload = require("../config/cloudinary");
const { parseGuideData } = require("../middleware/formDataParser");
const { auth, moderatorAndOwnerAuth } = require("../middleware/auth.middleware");

// Public routes
router.get("/", guideController.getAllGuides);
router.get("/:id", guideController.getGuideById);

// Protected routes
router.post("/", auth, upload.single("image"), parseGuideData, guideController.createManualGuide);
router.put("/:id", auth, upload.single("image"), parseGuideData, guideController.updateGuide);
router.post("/generate", auth, moderatorAndOwnerAuth, guideController.generateOfficialGuide);
router.post("/:id/comments", auth, guideController.addCommentToGuide);
router.delete("/:id/comments/:commentId", auth, guideController.deleteCommentFromGuide);
router.delete("/:id", auth, guideController.deleteGuide);

module.exports = router;
