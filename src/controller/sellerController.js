const UserRoles = require("../domain/userRole");
const VerificationCode = require("../model/VerificationCode");
const sellerService = require("../service/SellerService");
const jwtProvider = require("../util/jwtProvider");
const sendVerificationEmail = require("../util/sendEmail");
const Seller = require("../model/Seller");

class SellerController {

  /* ================= SEND LOGIN OTP ================= */
  async sendLoginOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      await VerificationCode.findOneAndUpdate(
        { email },
        { email, otp, createdAt: new Date() },
        { upsert: true, new: true }
      );

      await sendVerificationEmail(
        email,
        "Seller Login OTP",
        `<h2>Your OTP is ${otp}</h2><p>Valid for 5 minutes</p>`
      );

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("SEND LOGIN OTP ERROR:", error);
      return res.status(500).json({ message: "Failed to send OTP" });
    }
  }

  /* ================= VERIFY LOGIN OTP ================= */
  async verifyLoginOtp(req, res) {
    try {
      const { otp, email } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP required" });
      }

      const verificationCode = await VerificationCode.findOne({ email });

      if (!verificationCode || verificationCode.otp != otp) {
        return res.status(401).json({ message: "INVALID OTP" });
      }

      // 🔥 Fetch seller after OTP verification
      const seller = await Seller.findOne({ email })
        .populate("pickupAddress");

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      const token = jwtProvider.createJwt({
        id: seller._id,
        role: UserRoles.SELLER,
      });

      return res.status(200).json({
        message: "Login success",
        jwt: token,
        role: UserRoles.SELLER,
        seller,
      });
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
      return res.status(500).json({ message: "OTP verification failed" });
    }
  }

  /* ================= GET LOGGED-IN SELLER PROFILE ================= */
  async getSellerProfile(req, res) {
    try {
      const seller = await Seller.findById(req.seller._id)
        .populate("pickupAddress");

      return res.status(200).json(seller);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /* ================= CREATE SELLER ================= */
  async createSeller(req, res) {
    try {
      const seller = await sellerService.createSeller(req.body);

      return res.status(201).json({
        message: "Seller Created Successfully",
        seller,
      });
    } catch (error) {
      console.error("CREATE SELLER ERROR 👉", error);
      return res.status(500).json({
        message: error.message || "Failed to create seller",
      });
    }
  }

  /* ================= GET ALL SELLERS (ADMIN) ================= */
  async getAllSellers(req, res) {
    try {
      const status = req.query.status;

      const sellers = await Seller.find(
        status ? { accountStatus: status } : {}
      ).populate("pickupAddress");

      return res.status(200).json(sellers);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /* ================= UPDATE LOGGED-IN SELLER ================= */
  

  async updateSellers(req, res) {
  try {
    const freshSeller = await Seller.findById(req.seller._id)
      .populate("pickupAddress");

    const updatedSeller = await sellerService.updateSeller(
      freshSeller,
      req.body
    );

    return res.status(200).json(updatedSeller);
  } catch (error) {
    console.error("UPDATE SELLER ERROR →", error);
    return res.status(500).json({ message: error.message });
  }
}


  /* ================= DELETE SELLER (ADMIN) ================= */
  async deleteSellers(req, res) {
    try {
      await Seller.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "Seller deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /* ================= UPDATE SELLER ACCOUNT STATUS (ADMIN) ================= */
  async updateSellerAccountStatus(req, res) {
    try {
      const { id } = req.params;
      const { accountStatus } = req.body;

      const updatedSeller = await Seller.findByIdAndUpdate(
        id,
        { accountStatus },
        { new: true }
      ).populate("pickupAddress");

      return res.status(200).json(updatedSeller);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /* ================= GET SELLER BY ID (ADMIN) ================= */
async getSellerById(req, res) {
  try {
    const seller = await Seller.findById(req.params.id)
      .populate("pickupAddress")
      .populate("businessDetails")
      .populate("bankDetails");

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    return res.status(200).json(seller);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


}

module.exports = new SellerController();
