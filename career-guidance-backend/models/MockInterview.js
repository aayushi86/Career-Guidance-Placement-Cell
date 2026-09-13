const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["technical", "behavioral", "situational"],
      default: "technical",
    },
    skillFocus: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    studentAnswer: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    feedback: {
      strengths: {
        type: [String],
        default: [],
      },
      improvements: {
        type: [String],
        default: [],
      },
      idealAnswer: {
        type: String,
        default: "",
      },
      overallFeedback: {
        type: String,
        default: "",
      },
    },
    answeredAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true }
);

const mockInterviewSchema = new mongoose.Schema(
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
    },
    currentSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    questions: {
      type: [interviewQuestionSchema],
      default: [],
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MockInterview", mockInterviewSchema);