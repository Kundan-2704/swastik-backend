



// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// async function sendVerificationEmail(to, subject, body) {
//   try {
//     await resend.emails.send({
//       from: "Swastik <onboarding@resend.dev>",
//       to,
//       subject,
//       html: body,
//     });

//   } catch (error) {
//     console.error("❌ Email send failed:", error);
//     throw error;
//   }
// }

// module.exports = sendVerificationEmail;






const nodemailer = require("nodemailer");


console.log("BREVO LOGIN:", process.env.BREVO_LOGIN);
console.log("BREVO PASS:", process.env.BREVO_PASSWORD ? "EXISTS" : "MISSING");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_LOGIN,
    pass: process.env.BREVO_PASSWORD,
  },
    tls: {
    rejectUnauthorized: false, // 😎 prevents TLS drama
  },
});

async function sendVerificationEmail(to, subject, body) {
  try {
    const info = await transporter.sendMail({
      from: '"Swastik Handloom" <noreply@swastikhandloom.com>', 
      to,
      subject,
      html: body,
    });

    console.log("✅ Email sent:", info.messageId);

  } catch (error) {
    console.error("❌ Email failed:", error);
  }
}

module.exports = sendVerificationEmail;