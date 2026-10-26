const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    // Provide an actionable hint for the most common deployment failure:
    // Atlas Network Access must allow the server's IP (or 0.0.0.0/0 for Render).
    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("getaddrinfo") ||
      error.message.includes("ETIMEDOUT") ||
      error.message.includes("ServerSelectionError")
    ) {
      console.error(
        "⚠️  Could not reach MongoDB Atlas. If this is a production deployment, " +
        "ensure the server's IP address is whitelisted in Atlas → Network Access. " +
        "For Render.com deployments, add 0.0.0.0/0 (Allow from anywhere) since " +
        "outbound IPs are dynamic."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
