const Report = require("../models/report.model.js");

const getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ success: true, result: reports });
  } catch (e) {
    next(e);
  }
};

const createReport = async (req, res, next) => {
  try {
    const newReport = await Report.create({
      ...req.body,
      user_id: req.user._id,
    });
    res.status(201).json({ success: true, result: newReport });
  } catch (e) {
    next(e);
  }
};

const deleteReport = async (req, res, next) => {
  try {
    const deletedReport = await Report.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, result: deletedReport });
  } catch (e) {
    next(e);
  }
};

module.exports = { getAllReports, createReport, deleteReport };
