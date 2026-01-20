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




const nodemailer = require("nodemailer");

async function sendVerificationEmail(to, subject, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rajendradewangan2712@gmail.com",
        pass: "nayvzgivpwgzfcev" // ✅ app password (no spaces)
      }
    });

    const mailOptions = {
      from: `"Swastik App" <rajendradewangan2712@gmail.com>`,
      to,
      subject,
      html: body
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent to:", to);

  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error; // controller ko pata chale
  }
}

module.exports = sendVerificationEmail;
