const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_default_jwt_secret_key_12345";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Session token missing.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Session token missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    let id = decoded.id || decoded._id;
    let email = decoded.email;
    let role = decoded.role;
    let name = decoded.name;

    let userDoc = null;
    if (!email || !role || role === "recruiter") {
      userDoc = await User.findById(id).select("-password");
      if (userDoc) {
        email = userDoc.email;
        role = userDoc.role;
        name = userDoc.name;
      }
    }

    req.user = {
      id,
      _id: id,
      email: email ? email.toLowerCase().trim() : undefined,
      role: role || "student",
      name,
      company: userDoc?.company || decoded.company || "",
      verificationStatus: userDoc?.verificationStatus || decoded.verificationStatus || (role === "admin" || role === "student" ? "approved" : "pending"),
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized. Session token invalid or expired.",
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user?.role || "unauthorized"}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

// Recruiter verification check middleware
const requireApprovedRecruiter = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  if (req.user.role === "admin") {
    return next();
  }

  if (req.user.role !== "recruiter") {
    return res.status(403).json({ success: false, message: "Forbidden: Recruiter access required." });
  }

  // Double check fresh status from DB
  const user = await User.findById(req.user.id || req.user._id);
  if (!user || user.verificationStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: `Your recruiter account is currently '${user?.verificationStatus || "pending"}'. You will be able to post jobs and review applicants once approved by the administrator.`,
      verificationStatus: user?.verificationStatus || "pending",
    });
  }

  next();
};

module.exports = {
  protect,
  authorize,
  requireApprovedRecruiter,
};