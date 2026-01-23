const express = require("express");
const router = express.Router();

const AdminPaymentController = require("../controller/AdminPaymentController");
const adminAuth = require("../middleware/adminAuthMiddleware");

/* ================================
   ADMIN PAYMENTS
================================ */

// 🔹 list all payments
router.get(
  "/",
  adminAuth,
  AdminPaymentController.getAll
);

// 🔹 single payment detail
router.get(
  "/:id",
  adminAuth,
  AdminPaymentController.getOne
);

module.exports = router;
