const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Job information
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: false,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    recruiterEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Student information
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },

    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    education: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    matchedCareer: {
      type: String,
      default: "",
    },

    // AI / career score
    careerScore: {
      type: Number,
      default: 0,
    },

    // Application status
    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Offer Extended",
        "Rejected",
        "Selected",
      ],
      default: "Applied",
    },

    // Interview information
    interviewDate: {
      type: String,
      default: "",
    },

    interviewTime: {
      type: String,
      default: "",
    },

    interviewLink: {
      type: String,
      default: "",
    },

    interviewNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);