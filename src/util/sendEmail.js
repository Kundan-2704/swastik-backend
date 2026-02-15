



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






// const nodemailer = require("nodemailer");


// console.log("BREVO LOGIN:", process.env.BREVO_LOGIN);
// console.log("BREVO PASS:", process.env.BREVO_PASSWORD ? "EXISTS" : "MISSING");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.BREVO_LOGIN,
//     pass: process.env.BREVO_PASSWORD,
//   },
//     tls: {
//     rejectUnauthorized: false, // 😎 prevents TLS drama
//   },
// });

// async function sendVerificationEmail(to, subject, body) {
//   try {
//     const info = await transporter.sendMail({
//       from: '"Swastik Handloom" <noreply@swastikhandloom.com>', 
//       to,
//       subject,
//       html: body,
//     });

//     console.log("✅ Email sent:", info.messageId);

//   } catch (error) {
//     console.error("❌ Email failed:", error);
//   }
// }

// module.exports = sendVerificationEmail;






const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function sendVerificationEmail(to, subject, body) {
  try {

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "Swastik Handloom",
      email: "noreply@swastikhandloom.com",
    };

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = body;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent via API");

  } catch (error) {
    console.error("❌ API Email Error:", error.response?.body || error);
  }
}

module.exports = sendVerificationEmail;