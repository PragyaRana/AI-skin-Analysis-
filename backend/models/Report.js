import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl:     { type: String, required: true },
    overallScore:   { type: Number, default: 0 },
    acneScore:      { type: Number, default: 0 },
    glowScore:      { type: Number, default: 0 },
    hydrationScore: { type: Number, default: 0 },
    youthScore:     { type: Number, default: 0 },
    symmetryScore:  { type: Number, default: 0 },
    skinAge:        { type: Number },
    skinType:       { type: String, default: "normal" },
    issuesDetected: [{ name: String, severity: String, description: String }],
    remedies:         [String],
    dailyRoutine:     { morning: [String], evening: [String] },
    dietSuggestions:  [String],
    lifestyleChanges: [String],
    productRecommendations: [{ type: String, name: String, reason: String }],
    doctorConsultation: { required: { type: Boolean, default: false }, reason: String },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
