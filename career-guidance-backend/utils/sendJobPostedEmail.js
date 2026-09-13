const nodemailer = require("nodemailer");

/**
 * Utility to send job announcement emails to students.
 * Uses existing Nodemailer credentials without affecting OTP login emails.
 */
const sendJobPostedEmail = async ({ recipientEmail, studentName = "Student", job, frontendBaseUrl }) => {
  if (!recipientEmail || !job) {
    return { success: false, error: "Missing recipientEmail or job data." };
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Job email transport skipped: EMAIL_USER or EMAIL_PASS not configured in environment.");
    return { success: false, error: "SMTP credentials not configured." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const baseUrl = (
      frontendBaseUrl ||
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      process.env.PUBLIC_FRONTEND_URL ||
      "http://localhost:5173"
    ).replace(/\/+$/, "");

    const jobLink = `${baseUrl}/jobs/${job._id}`;

    const formattedDeadline = job.deadline
      ? new Date(job.deadline).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not specified";

    const requiredSkillsText = Array.isArray(job.requiredSkills)
      ? job.requiredSkills.join(", ")
      : job.requiredSkills || "General Domain Competencies";

    const mailOptions = {
      from: `"CareerAI Placement Cell" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `🚀 New Placement Drive: ${job.company} - ${job.title}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <!-- Header -->
          <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
            <span style="background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
              Campus Placement Opportunity
            </span>
            <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 12px 0 4px 0;">CareerAI Placement Cell</h2>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Official Placement Drive Notification</p>
          </div>

          <!-- Body Greeting -->
          <p style="color: #334155; font-size: 14px; margin-bottom: 16px;">
            Hello <strong>${studentName}</strong>,
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
            A new campus recruitment drive matching student eligibility criteria has just been published by <strong>${job.company}</strong>.
          </p>

          <!-- Job Card Box -->
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #2563eb; font-size: 18px; font-weight: 700; margin: 0 0 12px 0;">${job.title}</h3>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #475569;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; width: 130px; color: #1e293b;">Company:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${job.company}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">Domain:</td>
                <td style="padding: 6px 0;">${job.domain || "Placement Drive"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">Job Type:</td>
                <td style="padding: 6px 0;">${job.jobType || "Full-time"}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">Location:</td>
                <td style="padding: 6px 0;">${job.location || "Hybrid / Pan India"}</td>
              </tr>
              ${
                job.ctcPackage
                  ? `<tr>
                      <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">CTC Package:</td>
                      <td style="padding: 6px 0; font-weight: 700; color: #059669;">${job.ctcPackage}</td>
                    </tr>`
                  : ""
              }
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">Key Skills:</td>
                <td style="padding: 6px 0;">${requiredSkillsText}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #1e293b;">Application Deadline:</td>
                <td style="padding: 6px 0; color: #dc2626; font-weight: 600;">${formattedDeadline}</td>
              </tr>
            </table>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 28px 0;">
            <a href="${jobLink}" target="_blank" style="background-color: #2563eb; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);">
              View Opportunity & Apply →
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              This is an automated notification from the CareerAI Placement Cell System.<br />
              If you have any questions, please check your student dashboard.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, recipientEmail, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send job post email to ${recipientEmail}:`, error.message);
    return { success: false, recipientEmail, error: error.message };
  }
};

module.exports = sendJobPostedEmail;
