const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: { type: String, default: "Student Applicant" },
    email: { type: String, required: true, unique: true },
    degree: { type: String, default: "Undergraduate / Graduate" },
    education: { type: String, default: "Undergraduate / Graduate" },
    college: { type: String, default: "University Campus" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    preferredWorkStyle: { type: String, default: "Analytical" },
    targetRole: { type: String, default: "General Career Profile" },
    targetDomain: { type: String, default: "General Career Profile" },
    readinessScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);