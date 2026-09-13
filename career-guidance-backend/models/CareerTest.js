const mongoose = require("mongoose");

const careerTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Student Assessment",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    education: {
      type: String,
      default: "B.Sc IT",
    },
    preferredWorkStyle: {
      type: String,
      default: "Analytical",
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    recommendedCareer: {
      type: String,
      default: "Software Developer",
    },
    topRecommendation: {
      type: String,
      default: "Software Developer",
    },
    reason: {
      type: String,
      default: "",
    },
    careerMatches: {
      type: Array,
      default: [],
    },
    matchScores: {
      type: Array,
      default: [],
    },
    responses: {
      type: Array,
      default: [],
    },
    roadmap: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareerTest", careerTestSchema);