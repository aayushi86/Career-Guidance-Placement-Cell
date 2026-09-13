const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    fileName: {
      type: String,
      default: "resume.pdf",
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    detectedRole: {
      type: String,
      default: "",
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    verdict: {
      type: String,
      default: "",
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    scoreBreakdown: {
      atsParsing: { type: Number, default: 0 },
      keywordMatch: { type: Number, default: 0 },
      skillsMatch: { type: Number, default: 0 },
      experienceRelevance: { type: Number, default: 0 },
      projectQuality: { type: Number, default: 0 },
      educationRelevance: { type: Number, default: 0 },
      impactAndAchievements: { type: Number, default: 0 },
    },
    analysis: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);