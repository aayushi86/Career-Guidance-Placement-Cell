const Notification = require("../models/Notification");
const User = require("../models/User");

// ==========================================
// GET LOGGED-IN USER NOTIFICATIONS
// GET /api/notifications
// ==========================================
const getNotificationsForUser = async (req, res) => {
  try {
    let email = req.user?.email;

    // Fallback: If JWT payload only stored an ID, fetch the user's email from MongoDB
    if (!email && (req.user?._id || req.user?.id)) {
      const userId = req.user._id || req.user.id;
      const user = await User.findById(userId).select("email");
      if (user) {
        email = user.email;
      }
    }

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "User email not available.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const notifications = await Notification.find({
      recipientEmail: normalizedEmail,
    })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipientEmail: normalizedEmail,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Notification fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// ==========================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ==========================================
const markNotificationRead = async (req, res) => {
  try {
    let email = req.user?.email;

    if (!email && (req.user?._id || req.user?.id)) {
      const userId = req.user._id || req.user.id;
      const user = await User.findById(userId).select("email");
      if (user) {
        email = user.email;
      }
    }

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "User email not available.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipientEmail: normalizedEmail,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
};

module.exports = {
  getNotificationsForUser,
  markNotificationRead,
};