const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const AdminOrderController = require("../controller/AdminOrderController");

const router = express.Router();

// 🔥 ADMIN → ALL SELLER ORDERS
router.get(
  "/admin/orders",
  authMiddleware,
  AdminOrderController.getAllOrders
);

router.patch(
  "/orders/:orderId/status/:orderStatus",
  authMiddleware,
  AdminOrderController.updateOrderStatus
);



// Admin generates invoice (email)
router.post(
  "/admin/orders/:orderId/invoice",
  authMiddleware,
  AdminOrderController.generateInvoice
);

// Admin generates label (safety)
router.post(
  "/admin/orders/:orderId/courier/label",
  authMiddleware,
  AdminOrderController.generateLabel
);


// 🔥 ADMIN → UPDATE SHIPPING (manual DTDC)
router.put(
  "/orders/:orderId/shipping",
  authMiddleware,
  AdminOrderController.updateShipping
);


// 🔽 ADMIN → DOWNLOAD INVOICE
router.get(
  "/orders/:orderId/invoice/download",
  authMiddleware,
  AdminOrderController.downloadInvoice
);



module.exports = router;
