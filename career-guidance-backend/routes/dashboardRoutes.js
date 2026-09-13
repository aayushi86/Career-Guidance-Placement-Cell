const express = require("express");
const router = express.Router();
const { getCareerProgress } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/progress", protect, getCareerProgress);

module.exports = router;