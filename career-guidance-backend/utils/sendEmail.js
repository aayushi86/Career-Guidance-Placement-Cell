

const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"CareerAI Placement Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your CareerAI Login OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>CareerAI Placement Portal</h2>
        <p>Your OTP for login is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", email);
  } catch (error) {
    console.error("Nodemailer error:", error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };

