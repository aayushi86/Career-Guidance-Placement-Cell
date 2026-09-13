const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  applyJob,
  getMyApplications,
  getUserApplications,
  getAllApplications,
} = require("../controllers/applicationController");
const {
  getApplications: getRecruiterApplications,
  updateApplicationStatus,
} = require("../controllers/recruiterController");

// ==========================================
// STUDENT APPLICATION WORKFLOW
// ==========================================

// Apply for a job
router.post("/", protect, authorize("student", "admin"), applyJob);
router.post("/apply", protect, authorize("student", "admin"), applyJob);

// Retrieve authenticated student's own applications
router.get("/my-applications", protect, authorize("student", "admin"), getMyApplications);
router.get("/user/:email", protect, getUserApplications);
router.get("/student/:email", protect, getUserApplications);

// ==========================================
// RECRUITER APPLICATION MANAGEMENT (PROTECTED & SCOPED)
// ==========================================

router.get("/recruiter/applications", protect, authorize("recruiter", "admin"), getRecruiterApplications);
router.patch("/recruiter/applications/:id", protect, authorize("recruiter", "admin"), updateApplicationStatus);
router.put("/recruiter/applications/:id/status", protect, authorize("recruiter", "admin"), updateApplicationStatus);

// ==========================================
// ADMIN WORKFLOW
// ==========================================

router.get("/", protect, authorize("admin"), getAllApplications);

module.exports = router;