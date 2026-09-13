const mongoose = require("mongoose");

const monthSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    title: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    topics: {
      type: [String],
      default: [],
    },
    activities: {
      type: [String],
      default: [],
    },
    project: {
      type: String,
      default: "",
    },
    milestone: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const careerRoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    skillGapPercentage: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    roadmapSummary: {
      type: String,
      default: "",
    },
    careerOutcome: {
      type: String,
      default: "",
    },
    months: {
      type: [monthSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
    // ==========================================
    // PROGRESS TRACKING
    // ==========================================
    progress: {
      completedTasks: {
        type: [String],
        default: [],
      },
      completedMonths: {
        type: [Number],
        default: [],
      },
      overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CareerRoadmap", careerRoadmapSchema);