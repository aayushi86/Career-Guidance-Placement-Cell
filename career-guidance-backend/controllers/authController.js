const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendEmail");

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || "fallback_default_jwt_secret_key_12345",
    { expiresIn: "30d" }
  );
};

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "student", company = "", phone = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please Sign In.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationStatus = role === "recruiter" ? "pending" : "approved";

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      company: company ? company.trim() : "",
      phone: phone ? phone.trim() : "",
      verificationStatus,
    });

    const token = generateToken(user._id, user.email, user.role);

    return res.status(201).json({
      success: true,
      message:
        role === "recruiter"
          ? "Recruiter account registered! Awaiting admin verification."
          : "Account created successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error in authController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during registration.",
    });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user._id, user.email, user.role);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || "",
        phone: user.phone || "",
        verificationStatus: user.verificationStatus || (user.role === "recruiter" ? "pending" : "approved"),
      },
    });
  } catch (error) {
    console.error("❌ Login Error in authController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during login.",
    });
  }
};

// POST /api/auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Generate 6-digit numerical OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any previous OTP for this email
    await Otp.deleteMany({ email: cleanEmail });

    // Store new OTP
    await Otp.create({ email: cleanEmail, otp });

    // Try sending email (fallback to console if email credentials aren't set)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendOtpEmail(cleanEmail, otp);
    } else {
      console.log(`\n============================\n[LOCAL OTP FOR ${cleanEmail}]: ${otp}\n============================\n`);
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP email." });
  }
};

// POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp, name, role } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    const record = await Otp.findOne({ email: cleanEmail, otp: otp.trim() });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // Check if user exists; create account if first-time user
    let user = await User.findOne({ email: cleanEmail });
    if (!user) {
      let finalRole = "student"; // default

      // 🔥 ADMIN EMAIL CHECK
      if (cleanEmail === "careerai.admin@gmail.com") {
        finalRole = "admin";
      } else if (role === "recruiter") {
        finalRole = "recruiter";
      }

      const verificationStatus = finalRole === "recruiter" ? "pending" : "approved";

      user = await User.create({
        name: name ? name.trim() : cleanEmail.split("@")[0],
        email: cleanEmail,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        role: finalRole,
        verificationStatus,
      });
    }

    // Clean up OTP record
    await Otp.deleteMany({ email: cleanEmail });

    const token = generateToken(user._id, user.email, user.role);

    return res.status(200).json({
      success: true,
      message: "Authenticated successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company || "",
        phone: user.phone || "",
        verificationStatus: user.verificationStatus || (user.role === "recruiter" ? "pending" : "approved"),
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: "OTP Verification failed." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
};