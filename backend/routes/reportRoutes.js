const express = require("express");
const protect = require("../middleware/authMiddleware");
const Report  = require("../models/Report");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id, status: "completed" }).sort({ createdAt: -1 });
    res.json({ reports });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ error: "Report not found." });
    res.json({ report });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Deleted." });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
