const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "JOB_POSTED",
        "APPLICATION",
        "SHORTLISTED",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "GENERAL",
      ],
      default: "GENERAL",
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);