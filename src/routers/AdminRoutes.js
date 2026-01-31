

// const express = require('express');
// const sellerController = require('../controller/sellerController');
// const customerController = require('../controller/customerController');
// const AdminOrderController = require('../controller/AdminOrderController');
// const authMiddleware = require('../middleware/authMiddleware');

// const router = express.Router();

// router.patch(
//   "/seller/:id/status/:status",
//   sellerController.updateSellerAccountStatus
// );

// /* ================= CUSTOMER ================= */
// router.get("/customers", customerController.getAllCustomers);

// router.patch(
//   "/customers/:id/status/:status",
//   customerController.updateCustomerStatus
// );

// /* ================= ORDERS ================= */
// router.get(
//   "/orders",
//   authMiddleware,
//   AdminOrderController.getAllOrders
// );

// module.exports = router;





const express = require("express");
const sellerController = require("../controller/sellerController");
const customerController = require("../controller/customerController");
const AdminOrderController = require("../controller/AdminOrderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= SELLER ================= */
router.patch(
  "/seller/:id/status/:status",
  sellerController.updateSellerAccountStatus
);

/* ================= CUSTOMER ================= */
router.get("/customers", customerController.getAllCustomers);

router.patch(
  "/customers/:id/status/:status",
  customerController.updateCustomerStatus
);

/* ================= ORDERS ================= */

/* 🔹 ALL ORDERS */
router.get(
  "/orders",
  authMiddleware,
  AdminOrderController.getAllOrders
);

/* 🔥 SINGLE ORDER (THIS WAS MISSING) */
router.get(
  "/orders/:orderId",
  authMiddleware,
  AdminOrderController.getOrderById
);

// 📦 BULK MONTHLY INVOICE ZIP
router.get(
  "/orders/invoices/bulk",
  authMiddleware,
  AdminOrderController.downloadMonthlyInvoicesZip
);



module.exports = router;
