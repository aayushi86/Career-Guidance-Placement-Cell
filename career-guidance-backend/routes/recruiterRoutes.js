const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getRecruiterDashboard,
  getRecruiterJobs,
  postJob,
  updateApplicationStatus,
  getApplications,
  updateCompanyProfile,
  updateJob,
  closeJob,
} = require("../controllers/recruiterController");

const authorizeRecruiter = authorize("recruiter", "admin");

// ==========================================
// RECRUITER ROUTES
// ==========================================

router.get("/dashboard", protect, authorizeRecruiter, getRecruiterDashboard);
router.patch("/profile", protect, authorizeRecruiter, updateCompanyProfile);
router.get("/jobs", protect, authorizeRecruiter, getRecruiterJobs);
router.post("/jobs", protect, authorizeRecruiter, postJob);
router.put("/jobs/:id", protect, authorizeRecruiter, updateJob);
router.patch("/jobs/:id/close", protect, authorizeRecruiter, closeJob);
router.get("/applications", protect, authorizeRecruiter, getApplications);

// Status updates: Support both /applications/:id and /applications/:id/status (PUT & PATCH)
router.patch("/applications/:id", protect, authorizeRecruiter, updateApplicationStatus);
router.put("/applications/:id", protect, authorizeRecruiter, updateApplicationStatus);
router.patch("/applications/:id/status", protect, authorizeRecruiter, updateApplicationStatus);
router.put("/applications/:id/status", protect, authorizeRecruiter, updateApplicationStatus);

module.exports = router;