
const sendOtpEmail = async (email, otp) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing from environment variables.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Career Guidance <onboarding@resend.dev>",
      to: [email],
      subject: "Your Career Guidance Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Career Guidance and Placement Cell</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>Do not share this code with anyone.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Resend API error:", result);
    throw new Error(result.message || "Failed to send OTP email.");
  }

  return result;
};

module.exports = sendOtpEmail;
