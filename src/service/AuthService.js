// const Cart = require("../model/Cart");
// const Seller = require("../model/seller");
// const User = require("../model/User");
// const VerificationCode = require("../model/VerificationCode");
// const generateOTP = require("../util/generateOtp");
// const jwtProvider = require("../util/jwtProvider");
// const sendVerificationEmail = require("../util/sendEmail");
// const bcrypt = require("bcrypt");

// class AuthService {

//   /* ================= SEND LOGIN / SIGNUP OTP ================= */

//   async sendLoginOtp(email) {
//     const SIGNIN_PREFIX = "signin_";

//     // remove signin_ prefix if present
//     let pureEmail = email;
//     if (pureEmail.startsWith(SIGNIN_PREFIX)) {
//       pureEmail = pureEmail.replace(SIGNIN_PREFIX, "");
//     }

//     // check seller
//     const seller = await Seller.findOne({ email: pureEmail });

//     if (!seller) {
//       // user flow
//       let user = await User.findOne({ email: pureEmail });

//       // ✅ auto-create user ONLY if not exists
//       if (!user) {
//         user = new User({
//           email: pureEmail,
//           // ⛔ don't hardcode "New User"
//           // keep empty OR email-based fallback
//           fullName: pureEmail.split("@")[0],
//         });
//         await user.save();

//         const cart = new Cart({ user: user._id });
//         await cart.save();
//       }
//     }

//     // remove old OTP
//     await VerificationCode.deleteOne({ email: pureEmail });

//     // generate OTP
//     const otp = generateOTP();

//     await new VerificationCode({
//       otp,
//       email: pureEmail,
//     }).save();

//     // send email
//     const subject = "Luxora Login/Signup OTP";
//     const body = `
//       <div style="font-family: Arial, sans-serif;">
//         <h2>Welcome to Luxora!</h2>
//         <p>Your OTP for login/signup is:</p>
//         <h1>${otp}</h1>
//         <p>This OTP will expire in 10 minutes.</p>
//       </div>
//     `;

//     await sendVerificationEmail(pureEmail, subject, body);

//     return { message: "OTP sent successfully" };
//   }

//   /* ================= CREATE USER (SIGNUP) ================= */


// async createUser(req) {
//   console.log("🔥 CREATE USER HIT", req);

//   const { email, fullName, otp } = req;

//   const verificationCode = await VerificationCode.findOne({ email });
//   if (!verificationCode || verificationCode.otp !== otp) {
//     throw new Error("Invalid OTP");
//   }

//   let user = await User.findOne({ email });

//   if (user) {
//     // ✅ UPDATE existing user (created during OTP)
//     user.fullName = fullName || user.fullName || email.split("@")[0];
//     await user.save();
//   } else {
//     // fallback (rare)
//     user = new User({
//       email,
//       fullName: fullName || email.split("@")[0],
//     });
//     await user.save();

//     const cart = new Cart({ user: user._id });
//     await cart.save();
//   }

//   console.log("✅ USER AFTER SAVE", user);

//   return jwtProvider.createJwt({ email });
// }


//   /* ================= SIGNIN (OTP LOGIN) ================= */

//   async signin(req) {
//     const { email, otp } = req;

//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new Error("User not found with email");
//     }

//     const verificationCode = await VerificationCode.findOne({ email });
//     if (!verificationCode || verificationCode.otp !== otp) {
//       throw new Error("Invalid OTP");
//     }

//     return {
//       message: "Login success",
//       jwt: jwtProvider.createJwt({ email }),
//       role: user.role,
//     };
//   }
// }

// module.exports = new AuthService();




const Cart = require("../model/Cart");
const User = require("../model/User");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../util/generateOtp");
const jwtProvider = require("../util/jwtProvider"); // ✅ NO destructuring
const sendVerificationEmail = require("../util/sendEmail");

class AuthService {

  /* ================= SEND LOGIN OTP ================= */

  async sendLoginOtp(email) {
    const SIGNIN_PREFIX = "signin_";

    const pureEmail = email.startsWith(SIGNIN_PREFIX)
      ? email.replace(SIGNIN_PREFIX, "")
      : email;

    await VerificationCode.deleteOne({ email: pureEmail });

    const otp = generateOTP();

    await new VerificationCode({
      email: pureEmail,
      otp,
    }).save();

    await sendVerificationEmail(
      pureEmail,
      "Login OTP",
      `<h2>Your OTP is ${otp}</h2>`
    );

    return { message: "OTP sent successfully" };
  }

  /* ================= CREATE USER (SIGNUP) ================= */

  async createUser(req) {
    const { email, fullName, otp } = req;

    const verificationCode = await VerificationCode.findOne({ email });
    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        fullName: fullName || email.split("@")[0],
        role: "ROLE_CUSTOMER",
      });
      await user.save();

      const cart = new Cart({ user: user._id });
      await cart.save();
    }

    return {
      message: "Signup success",
      jwt: jwtProvider.createJwt({
        id: user._id,
        email: user.email,
        role: user.role,
      }),
      role: user.role,
    };
  }

  /* ================= SIGNIN ================= */

  async signin(req) {
    const { email, otp } = req;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found. Please signup first.");
    }

    const verificationCode = await VerificationCode.findOne({ email });
    if (!verificationCode || verificationCode.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    return {
      message: "Login success",
      jwt: jwtProvider.createJwt({
        id: user._id,
        email: user.email,
        role: user.role,
      }),
      role: user.role,
    };
  }
}

module.exports = new AuthService();
