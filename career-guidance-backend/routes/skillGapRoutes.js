const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCareerDomainsData,
  getAvailableRoles,
  analyzeSkillGap,
  generateCareerRoadmap,
  getMyRoadmap,
  updateRoadmapProgress,
} = require("../controllers/skillGapController");

// Domains, Roles and Skill Analysis (Public Metadata)
router.get("/domains", getCareerDomainsData);
router.get("/roles", getAvailableRoles);
router.post("/analyze", protect, analyzeSkillGap);
router.post("/gap-analysis", protect, analyzeSkillGap);

// AI Roadmap Generation and Retrieval
router.post("/generate-roadmap", protect, generateCareerRoadmap);
router.get("/my-roadmap", protect, getMyRoadmap);

// Progress Tracking
router.patch("/roadmap/:roadmapId/progress", protect, updateRoadmapProgress);

module.exports = router;