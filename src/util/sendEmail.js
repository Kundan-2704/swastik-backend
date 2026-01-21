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



const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, subject, body) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // 🔥 IMPORTANT
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 20000, // ⏱️ timeout fix
      greetingTimeout: 20000,
      socketTimeout: 20000,
    });

    const mailOptions = {
      from: `"Swastik App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: body,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
}

module.exports = sendVerificationEmail;
