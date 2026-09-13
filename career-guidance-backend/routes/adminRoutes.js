const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getRecruiters,
  verifyRecruiter,
  getStudents,
  deleteStudent,
  getJobs,
  toggleJobStatus,
  deleteJob,
  getApplications,
  getAnalytics,
  sendAnnouncement,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All admin routes strictly require admin authorization
router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/recruiters", getRecruiters);
router.patch("/recruiters/:id/verify", verifyRecruiter);
router.get("/students", getStudents);
router.delete("/students/:id", deleteStudent);
router.get("/jobs", getJobs);
router.patch("/jobs/:id/status", toggleJobStatus);
router.delete("/jobs/:id", deleteJob);
router.get("/applications", getApplications);
router.get("/analytics", getAnalytics);
router.post("/announcements", sendAnnouncement);

module.exports = router;