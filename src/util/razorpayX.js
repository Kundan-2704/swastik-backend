const Razorpay = require("razorpay");

let razorpay;

const initRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing in env");
  }

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const createPayout = async ({ amount, bankAccountId }) => {
  if (!razorpay) throw new Error("Razorpay not initialized");

  return razorpay.payouts.create({
    account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER,
    fund_account_id: bankAccountId,
    amount: Math.round(amount * 100),
    currency: "INR",
    mode: "IMPS",
    purpose: "payout",
    queue_if_low_balance: true,
  });
};

module.exports = { initRazorpay, createPayout };
