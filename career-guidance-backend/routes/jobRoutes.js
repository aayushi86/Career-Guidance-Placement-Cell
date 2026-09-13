const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createJNF,
  getMyApplications,
  getJobs,
  getJobRecommendations,
  applyJob,
  getRecommendedJobs,
  getJobMatchDetails,
  getStudentVisibleJobQuery,
} = require("../controllers/jobController");
const {
  getApplications: getRecruiterApplications,
  updateApplicationStatus,
} = require("../controllers/recruiterController");

// 1. GET ALL JOBS (Student visible only)
router.get("/", getJobs);

// 2. GET AI RECOMMENDED JOBS FOR STUDENT (Must precede /:id)
router.get("/recommended", protect, authorize("student", "admin"), getRecommendedJobs);

// 3. GET JOB RECOMMENDATIONS BY CAREER QUERY (Must precede /:id)
router.get("/recommendations", getJobRecommendations);

// 4. GET APPLICATIONS FOR A STUDENT (Must precede /:id)
router.get("/my-applications", protect, authorize("student", "admin"), getMyApplications);

// 5. CREATE A NEW JOB (JNF) - Recruiter only
router.post("/", protect, authorize("recruiter", "admin"), createJNF);
router.post("/jnf", protect, authorize("recruiter", "admin"), createJNF);

// 6. STUDENT 1-CLICK APPLY
router.post("/apply", protect, authorize("student", "admin"), applyJob);

// 7. RECRUITER APPLICATIONS COMPATIBILITY ALIASES
router.get("/recruiter/applications", protect, authorize("recruiter", "admin"), getRecruiterApplications);
router.patch("/recruiter/applications/:id", protect, authorize("recruiter", "admin"), updateApplicationStatus);

// 8. GET DYNAMIC JOB MATCH DETAILS FOR LOGGED-IN STUDENT
router.get("/:id/match", protect, authorize("student", "admin"), getJobMatchDetails);

// 9. GET JOB BY ID (Protected by student visibility rules)
router.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    let job = null;

    // Check if caller is student or public
    if (!req.user || req.user.role === "student") {
      const studentFilter = await getStudentVisibleJobQuery({ _id: jobId });
      job = await Job.findOne(studentFilter);
    } else {
      // Recruiter or Admin access to their own / live jobs
      job = await Job.findById(jobId);
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job drive not found or no longer active.",
      });
    }

    return res.status(200).json({
      success: true,
      job,
      data: job,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
});

module.exports = router;