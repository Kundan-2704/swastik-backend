const Affiliate = require("../models/Affiliate");
const AffiliateCommission = require("../models/AffiliateCommission");
const AffiliateClick = require("../models/AffiliateClick");
const AffiliateWithdrawal = require("../models/AffiliateWithdrawal");

class AffiliateService {

  // ======================================
  // REGISTER
  // ======================================
  async register(userId) {
    const exists = await Affiliate.findOne({ userId });
    if (exists) throw new Error("Already affiliate");

    const referralCode = `AFF${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    return await Affiliate.create({
      userId,
      referralCode,
    });
  }

  // ======================================
  // TRACK CLICK
  // ======================================
  async trackClick(referralCode, req) {
    const affiliate = await Affiliate.findOne({ referralCode });
    if (!affiliate || affiliate.status !== "active") return;

    await AffiliateClick.create({
      affiliateId: affiliate._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  }

  // ======================================
  // CREATE COMMISSION (Webhook Safe)
  // ======================================
  async createCommission(order, referralCode) {
    if (!referralCode) return;

    const affiliate = await Affiliate.findOne({ referralCode });
    if (!affiliate || affiliate.status !== "active") return;

    if (order.user.toString() === affiliate.userId.toString()) return;

    const exists = await AffiliateCommission.findOne({
      orderId: order._id,
    });

    if (exists) return;

    const commissionAmount =
      (order.finalAmount * affiliate.commissionRate) / 100;

    await AffiliateCommission.create({
      affiliateId: affiliate._id,
      orderId: order._id,
      orderAmount: order.finalAmount,
      commissionAmount,
    });

    affiliate.pendingEarnings += commissionAmount;
    await affiliate.save();
  }

  // ======================================
  // DASHBOARD
  // ======================================
  async getDashboard(userId) {
    const affiliate = await Affiliate.findOne({ userId });
    if (!affiliate) throw new Error("Not affiliate");

    const commissions = await AffiliateCommission.find({
      affiliateId: affiliate._id,
    }).sort({ createdAt: -1 });

    const clicks = await AffiliateClick.countDocuments({
      affiliateId: affiliate._id,
    });

    return {
      referralCode: affiliate.referralCode,
      referralLink: `${process.env.FRONTEND_URL}?ref=${affiliate.referralCode}`,
      totalClicks: clicks,
      totalOrders: commissions.length,
      totalEarnings: affiliate.totalEarnings,
      pendingEarnings: affiliate.pendingEarnings,
      commissions,
    };
  }

  // ======================================
  // REQUEST WITHDRAWAL
  // ======================================
  async requestWithdrawal(userId) {
    const affiliate = await Affiliate.findOne({ userId });
    if (!affiliate) throw new Error("Not affiliate");

    if (affiliate.pendingEarnings < 1000)
      throw new Error("Minimum ₹1000 required");

    const withdrawal = await AffiliateWithdrawal.create({
      affiliateId: affiliate._id,
      amount: affiliate.pendingEarnings,
    });

    affiliate.totalEarnings += affiliate.pendingEarnings;
    affiliate.pendingEarnings = 0;
    await affiliate.save();

    return withdrawal;
  }

  // ======================================
  // ADMIN APPROVE WITHDRAWAL
  // ======================================
  async approveWithdrawal(withdrawalId) {
    const withdrawal = await AffiliateWithdrawal.findById(withdrawalId);
    if (!withdrawal) throw new Error("Not found");

    withdrawal.status = "approved";
    await withdrawal.save();

    return withdrawal;
  }
}

module.exports = new AffiliateService();