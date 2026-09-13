const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"CareerAI Placement Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your Verification Code: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #2563eb; margin: 0;">CareerAI Placement Cell</h2>
        <p style="color: #475569; font-size: 14px; margin-top: 8px;">
          Use the OTP below to complete your login. It is valid for 5 minutes.
        </p>
        <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0f172a;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">If you did not request this, please disregard this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;