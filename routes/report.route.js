const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller.js");
const { moderatorAndOwnerAuth } = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.js");
const reportSchema = require("../validations/report.validation.js");

router.get("/", moderatorAndOwnerAuth, reportController.getAllReports);
router.post(
  "/",
  moderatorAndOwnerAuth,
  validate(reportSchema),
  reportController.createReport,
);
router.delete("/:id", moderatorAndOwnerAuth, reportController.deleteReport);

module.exports = router;
