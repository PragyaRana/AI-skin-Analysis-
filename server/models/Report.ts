import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageUrl: { type: String },
  overallScore: { type: Number, required: true },
  acneScore: { type: Number },
  glowScore: { type: Number },
  hydrationScore: { type: Number },
  youthScore: { type: Number },
  skinAge: { type: Number },
  issuesDetected: [String],
  remedies: [String],
  routine: [String],
  diet: [String],
  lifestyle: [String],
  products: [String],
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model("Report", ReportSchema);
