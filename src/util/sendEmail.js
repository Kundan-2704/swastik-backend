// const nodemailer = require('nodemailer')

// async function sendVerificationEmail(to, subject, body) {
//     const transpoter = nodemailer.createTransport({
//         service : "gmail",
//         auth:{
//             user: "rajendradewangan2712@gmail.com",
//             pass: "nayvzgivpwgzfcev"
//         }
//     });

//     const mailOptions = {
//         from: "rajendradewangan2712@gmail.com",
//         to,
//         subject,
//         html: body
//     }

//     await transpoter.sendMail(mailOptions)

// }

// module.exports = sendVerificationEmail




// const nodemailer = require("nodemailer");

// async function sendVerificationEmail(to, subject, body) {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // ✅ your email
//         pass: process.env.EMAIL_PASS // ✅ app password (no spaces)
//       }
//     });

//     const mailOptions = {
//       from: `"Swastik App" <rajendradewangan2712@gmail.com>`,
//       to,
//       subject,
//       html: body
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Email sent to:", to);

//   } catch (error) {
//     console.error("❌ Email send failed:", error);
//     throw error; // controller ko pata chale
//   }
// }

// module.exports = sendVerificationEmail;



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

//     console.log("✅ Email sent to:", to);
//   } catch (error) {
//     console.error("❌ Email send failed:", error);
//     throw error;
//   }
// }

// module.exports = sendVerificationEmail;




const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

async function sendVerificationEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Swastik" <${process.env.BREVO_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
    throw err;
  }
}

module.exports = sendVerificationEmail;
