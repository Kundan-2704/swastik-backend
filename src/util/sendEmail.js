



const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(to, subject, body) {
  try {
    await resend.emails.send({
      from: "Swastik <onboarding@resend.dev>",
      to,
      subject,
      html: body,
    });

  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
}

module.exports = sendVerificationEmail;
