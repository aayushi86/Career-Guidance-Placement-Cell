const express = require("express");
const router = express.Router();
const {
  generateMockInterview,
  submitAnswer,
  getLatestInterview,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/generate", protect, generateMockInterview);
router.get("/latest", protect, getLatestInterview);
router.post("/:interviewId/questions/:questionId/answer", protect, submitAnswer);

module.exports = router;