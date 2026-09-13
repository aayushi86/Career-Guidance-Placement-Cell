const express = require("express");
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getStudentProfile);
router.get("/dashboard", protect, getStudentProfile);
router.get("/", protect, getStudentProfile);
router.put("/profile", protect, updateStudentProfile);

module.exports = router;