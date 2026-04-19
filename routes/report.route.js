const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller.js");
const {
  auth,
  moderatorAndOwnerAuth,
} = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const { createReportSchema } = require("../validations/report.validation.js");

// All report routes require authentication
router.use(auth);

// Only moderators and owners can see all reports
router.get("/", moderatorAndOwnerAuth, reportController.getAllReports);

// Any authenticated user can create a report
router.post("/", validate(reportSchema), reportController.createReport);

// Only moderators and owners can delete reports
router.delete("/:id", moderatorAndOwnerAuth, reportController.deleteReport);

module.exports = router;
