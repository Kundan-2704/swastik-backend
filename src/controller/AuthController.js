const admin = require("../config/firebaseAdmin");
const UserRoles = require("../domain/userRole");
const AuthService = require("../service/AuthService");

const UserService = require("../service/UserService");
const SellerService = require("../service/SellerService");
const jwtProvider = require("../util/jwtProvider");

const User = require("../model/User"); // 🔥 MISSING IMPORT

const Seller = require("../model/Seller");

/* 🔐 ADMIN EMAIL SAFETY (optional but recommended) */
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",");

class authController {
  /* ================= OTP LOGIN ================= */
  async sendLoginOtp(req, res) {
    try {
      const email = req.body.email;
      await AuthService.sendLoginOtp(email);
      res.status(200).json({ message: "otp send successfully" });
    } catch (error) {
      res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
    }
  }

  /* ================= EMAIL SIGNUP ================= */
  async createUser(req, res) {
    try {
      const jwt = await AuthService.createUser(req.body);

      res.status(200).json({
        jwt,
        message: "User Created Successfully",
        role: UserRoles.CUSTOMER,
      });
    } catch (error) {
      res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
    }
  }

  /* ================= EMAIL LOGIN ================= */
  async signin(req, res) {
    try {
      const authRes = await AuthService.signin(req.body);
      res.status(200).json(authRes);
    } catch (error) {
      res.status(error instanceof Error ? 404 : 500).json({ message: error.message });
    }
  }

  /* ================= GOOGLE SIGNUP ================= */

async  googleSignup(req, res) {
  try {
    const { idToken, autoLogin = false } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "idToken missing" });
    }

    /* ================= VERIFY FIREBASE TOKEN ================= */
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid } = decoded;

    /* ================= CHECK EXISTING USER ================= */
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Account already exists. Please login.",
      });
    }

    /* ================= CREATE USER ================= */
    const user = await User.create({
      fullName: name || "",
      email,
      role: UserRoles.CUSTOMER, // ✅ ALWAYS ENUM (IMPORTANT FIX)
      provider: "google",
      googleUid: uid,
      isVerified: true,
    });

    /* ================= AUTO LOGIN (OPTIONAL) ================= */
    if (!autoLogin) {
      return res.status(200).json({
        message: "Account created successfully. Please login.",
      });
    }

   const token = jwtProvider.createJwt({ email });


    return res.status(200).json({
      token,
      user,
    });

  } catch (error) {
    console.error("googleSignup error:", error.message);
    return res.status(401).json({
      message: error.message || "Google signup failed",
    });
  }
}


  /* ================= GOOGLE LOGIN ================= */





async googleLogin(req, res) {
  try {
    const { idToken, role } = req.body; // ✅ CAPTURE ROLE


    if (!idToken)
      return res.status(400).json({ message: "Id token required" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Account not found. Please signup first." });
    }

    /* ================= ROLE SWITCH LOGIC 🔥 ================= */

    // ✅ SELLER LOGIN FLOW
    if (role === "seller") {

      // const seller = await Seller.findOne({ userId: user._id });
      const seller = await Seller.findOne({ email: user.email }); 

      if (!seller) {
        return res.status(403).json({
          message: "Seller account not found",
        });
      }

      const token = jwtProvider.createJwt({
        id: user._id,
        email: user.email,
        role: "ROLE_SELLER", 
        sellerId: seller._id 
      });

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: "ROLE_SELLER",
          fullName: user.fullName,
        },
        redirect: "/seller/dashboard",
      });
    }

    // ✅ NORMAL CUSTOMER LOGIN
    const token = jwtProvider.createJwt({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    let redirect = "/";
    if (user.role === "ROLE_ADMIN") redirect = "/admin";

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      redirect,
    });

  } catch (error) {
    console.error("googleLogin error:", error);
    res.status(401).json({
      message: error.message || "Google login failed",
    });
  }
}


}

module.exports = new authController();
