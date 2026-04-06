




const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const PaymentController = require("../controller/PaymentController");


const router = express.Router();

/* =====================================================
   1️⃣ CREATE RAZORPAY ORDER
   Frontend checkout click → hit this
===================================================== */


router.post(
  "/razorpay/create-order",
  authMiddleware,
  PaymentController.createRazorpayOrder
);

/* =====================================================
   2️⃣ RAZORPAY WEBHOOK (🔥 SOURCE OF TRUTH)
   Razorpay → Backend (NO auth, NO json parser)
===================================================== */


/* 🔥 ADD THIS */
router.post(
  "/razorpay/verify",
  authMiddleware,
  PaymentController.verifyPayment
);


/* =====================================================
   3️⃣ SELLER DASHBOARD SUMMARY
===================================================== */
router.get(
  "/summary",
  authMiddleware,
  PaymentController.getSummary
);

/* =====================================================
   4️⃣ SELLER PAYOUT HISTORY
===================================================== */
router.get(
  "/history",
  authMiddleware,
  PaymentController.getHistory
);

/* =====================================================
   5️⃣ MANUAL PAYOUT REQUEST
===================================================== */
router.post(
  "/request-payout",
  authMiddleware,
  PaymentController.requestPayout
);

router.post("/create-cod-order", authMiddleware, PaymentController.createCODOrder);

module.exports = router;
