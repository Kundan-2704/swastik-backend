const mongoose = require("mongoose");
const Payout = require("../model/Payout");
const SellerWallet = require("../model/SellerWallet");

class PayoutService {

  static async createPayout(data) {
    // 🔁 detect if transactions supported
    const session = await mongoose.startSession();
    let useTxn = true;

    try {
      session.startTransaction();
    } catch (e) {
      useTxn = false;
    }

    try {
      if (useTxn) {
        return await this.createWithTransaction(data, session);
      } else {
        return await this.createWithoutTransaction(data);
      }
    } finally {
      session.endSession();
    }
  }

  // ================= TRANSACTION MODE =================
  static async createWithTransaction(data, session) {
    const wallet = await SellerWallet.findOne({
      seller: data.seller
    }).session(session);

    if (!wallet) throw new Error("Wallet not found");
    if (wallet.availableBalance < data.amount) {
      throw new Error("Insufficient balance");
    }

    wallet.availableBalance -= data.amount;
    wallet.holdBalance += data.amount;
    await wallet.save({ session });

    const payout = await Payout.create([{
      ...data,
      status: "pending"
    }], { session });

    await session.commitTransaction();
    return payout[0];
  }

  // ================= NON TRANSACTION MODE =================
  static async createWithoutTransaction(data) {
    const wallet = await SellerWallet.findOne({
      seller: data.seller
    });

    if (!wallet) throw new Error("Wallet not found");
    if (wallet.availableBalance < data.amount) {
      throw new Error("Insufficient balance");
    }

    wallet.availableBalance -= data.amount;
    wallet.holdBalance += data.amount;
    await wallet.save();

    const payout = await Payout.create({
      ...data,
      status: "pending"
    });

    return payout;
  }

  // ================= GET SELLER PAYOUTS =================
  static async getSellerPayouts(sellerId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const payouts = await Payout.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payout.countDocuments({ seller: sellerId });

    return { payouts, total, page, limit };
  }

  // ================= ADMIN GET ALL PAYOUTS =================
  static async getAllPayouts(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const payouts = await Payout.find()
      .populate("seller", "shopName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payout.countDocuments();

    return { payouts, total, page, limit };
  }

  // ================= ADMIN UPDATE STATUS =================
  // ================= ADMIN UPDATE STATUS =================
static async updateStatus(payoutId, status, adminId) {

  if (!["processing", "paid", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const payout = await Payout.findById(payoutId);
  if (!payout) throw new Error("Payout not found");

  payout.status = status;
  payout.processedBy = adminId;
  payout.processedAt = new Date();

  await payout.save();
  return payout;
}




}

module.exports = PayoutService;
