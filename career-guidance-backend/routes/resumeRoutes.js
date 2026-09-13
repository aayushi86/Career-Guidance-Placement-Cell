const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  analyzeResume,
  getResumeHistory,
  getResumeAnalysisById,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// History Endpoints
router.get("/history", protect, getResumeHistory);
router.get("/history/:id", protect, getResumeAnalysisById);

// Analyze Endpoints (protect attached so req.user is decoded and saved to DB)
router.post("/analyze", protect, upload.single("resume"), analyzeResume);
router.post("/grade", protect, upload.single("resume"), analyzeResume);

module.exports = router;
