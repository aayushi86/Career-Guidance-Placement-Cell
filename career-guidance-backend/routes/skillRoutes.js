const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCareerDomainsData,
  getAvailableRoles,
  analyzeSkillGap,
  generateCareerRoadmap,
  getMyRoadmap,
} = require("../controllers/skillGapController");

router.get("/domains", getCareerDomainsData);
router.get("/roles", getAvailableRoles);
router.post("/gap-analysis", protect, analyzeSkillGap);
router.post("/analyze", protect, analyzeSkillGap);
router.post("/", protect, analyzeSkillGap);
router.get("/my-roadmap", protect, getMyRoadmap);

module.exports = router;