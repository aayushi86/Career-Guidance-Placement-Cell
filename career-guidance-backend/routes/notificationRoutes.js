const express = require("express");

const router = express.Router();

const {
  getNotificationsForUser,
  markNotificationRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// GET LOGGED-IN USER NOTIFICATIONS
// GET /api/notifications
// ==========================================
router.get("/", protect, getNotificationsForUser);

// ==========================================
// MARK NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ==========================================
router.patch("/:id/read", protect, markNotificationRead);

module.exports = router;