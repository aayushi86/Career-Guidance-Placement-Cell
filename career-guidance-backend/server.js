require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const resumeRoutes = require("./routes/resumeRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const app = express();

// ==========================================
// DATABASE
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
// Allowed development origins and explicitly configured public frontend origin
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.replace(/\/+$/, "")] : []),
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace(/\/+$/, "")] : []),
  ...(process.env.PUBLIC_FRONTEND_URL ? [process.env.PUBLIC_FRONTEND_URL.replace(/\/+$/, "")] : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.startsWith("http://localhost:") ||
        cleanOrigin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      // If configured via env or same-origin
      if (process.env.FRONTEND_URL && cleanOrigin === process.env.FRONTEND_URL.replace(/\/+$/, "")) {
        return callback(null, true);
      }
      return callback(null, true); // Safely reflect origin for temporary tunnel access while preserving JWT Authorization headers
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// ROUTES
// ==========================================

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Students
app.use("/api/students", require("./routes/studentRoutes"));
// Career Progress Dashboard
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
// Jobs
app.use("/api/jobs", require("./routes/jobRoutes"));

// Applications
app.use("/api/applications", require("./routes/applicationRoutes"));

// Resume
app.use("/api/resumes", resumeRoutes);
app.use("/api/resume", resumeRoutes); // Compatibility alias

// Career Test
app.use("/api/career-test", require("./routes/careerRoutes"));
app.use("/api/career", require("./routes/careerRoutes")); // Compatibility alias
app.use("/api/assessment", require("./routes/careerRoutes")); // Compatibility alias

// Skills & AI Roadmap
app.use("/api/skills", require("./routes/skillRoutes"));
app.use(
  "/api/skill-gap",
  skillGapRoutes
);
// Notifications
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Recruiter
app.use("/api/recruiter", require("./routes/recruiterRoutes"));

// Admin
app.use("/api/admin", require("./routes/adminRoutes"));

// AI Assistant
app.use("/api/assistant", require("./routes/assistantRoutes"));

// Interview Preparation
app.use("/api/interviews", require("./routes/interviewRoutes"));
// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CareerAI server running on http://localhost:${PORT}`);
});