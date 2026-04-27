const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  results: {
    skinType: { type: String, default: '' },
    concerns: [{ type: String }],
    recommendations: [{ type: String }],
    overallScore: { type: Number, min: 0, max: 100 },
    details: { type: mongoose.Schema.Types.Mixed }
  },
  aiResponse: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analysis', analysisSchema);
