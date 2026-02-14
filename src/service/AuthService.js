

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

  // old otp remove
  await VerificationCode.deleteOne({ email: pureEmail });

  const otp = generateOTP();

  // ✅ expiry add (production fix)
  await VerificationCode.create({
    email: pureEmail,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
  });

  // ✅ always send email (admin/customer same)
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
