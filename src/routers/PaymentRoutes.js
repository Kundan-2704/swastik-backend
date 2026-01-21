


// const express = require("express");
// const authMiddleware = require("../middleware/authMiddleware.js");
// const PaymentController = require("../controller/PaymentController.js");

// const router = express.Router();

// /**
//  * 1️⃣ CREATE RAZORPAY ORDER
//  * Frontend checkout click → yeh hit hoga
//  */
// router.post(
//   "/razorpay/create-order",
//   authMiddleware,
//   PaymentController.createRazorpayOrder
// );

// /**
//  * 2️⃣ PAYMENT SUCCESS / VERIFY
//  * Razorpay popup success ke baad
//  */
// router.post(
//   "/razorpay/verify",
//   authMiddleware,
//   PaymentController.paymentsuccessHandler
// );


// router.post(
//   "/razorpay/webhook",
//   express.raw({ type: "application/json" }),
//   paymentController.razorpayWebhook
// );



// /* ================================
//    SELLER DASHBOARD (Payments)
// ================================ */

// // 3️⃣ Seller payment summary (cards)
// router.get(
//   "/summary",
//   authMiddleware,
//   PaymentController.getSummary
// );

// // 4️⃣ Seller payout history
// router.get(
//   "/history",
//   authMiddleware,
//   PaymentController.getHistory
// );

// // 5️⃣ (Optional) Manual payout request
// router.post(
//   "/request-payout",
//   authMiddleware,
//   PaymentController.requestPayout
// );




// module.exports = router;






const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const PaymentController = require("../controller/PaymentController");

const router = express.Router();

/* =====================================================
   1️⃣ CREATE RAZORPAY ORDER
   Frontend checkout click → hit this
===================================================== */
// router.post(
//   "/razorpay/create-order",
//   authMiddleware,
//   PaymentController.createRazorpayOrder
// );
router.post(
  "/razorpay/create-order",
  PaymentController.createRazorpayOrder
);

/* =====================================================
   2️⃣ RAZORPAY WEBHOOK (🔥 SOURCE OF TRUTH)
   Razorpay → Backend (NO auth, NO json parser)
===================================================== */


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

module.exports = router;
