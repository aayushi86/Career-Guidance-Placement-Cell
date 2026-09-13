const express = require("express");
const router = express.Router();
const {
  submitCareerTest,
  getCareerTestResults,
  updateRoadmapStep,
} = require("../controllers/careerTestController");
const { getCareerDomainsData } = require("../controllers/skillGapController");
const { protect } = require("../middleware/authMiddleware");

// Public domain & role metadata
router.get("/domains", getCareerDomainsData);
router.get("/roles", getCareerDomainsData);

// Submit assessment
router.post("/", protect, submitCareerTest);

// Assessment history & aliases
router.get("/", protect, getCareerTestResults);
router.get("/history", protect, getCareerTestResults);
router.get("/results", protect, getCareerTestResults);

// Toggle roadmap step completion
router.patch("/:id/roadmap-step", protect, updateRoadmapStep);

module.exports = router;