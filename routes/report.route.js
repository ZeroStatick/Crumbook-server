const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller.js");
const { auth, moderatorAndOwnerAuth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const { createReportSchema } = require("../validations/report.validation.js");

// Only admins/owners can see all reports
router.get("/", auth, moderatorAndOwnerAuth, reportController.getAllReports);

// Any authenticated user can create a report
router.post(
  "/",
  auth,
  validate(createReportSchema),
  reportController.createReport,
);

// Only admins/owners can resolve (delete) reports
router.delete("/:id", auth, moderatorAndOwnerAuth, reportController.deleteReport);

module.exports = router;
