const Analysis = require('../models/Analysis.model');

// @desc    Create new analysis
// @route   POST /api/analysis
const createAnalysis = async (req, res) => {
  try {
    const { results, aiResponse } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const analysis = await Analysis.create({
      user: req.user._id,
      imageUrl,
      results,
      aiResponse
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all analyses for logged-in user
// @route   GET /api/analysis
const getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single analysis
// @route   GET /api/analysis/:id
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Verify ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete analysis
// @route   DELETE /api/analysis/:id
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await analysis.deleteOne();
    res.json({ message: 'Analysis deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnalysis, getAnalyses, getAnalysisById, deleteAnalysis };
