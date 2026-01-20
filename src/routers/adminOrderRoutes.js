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

module.exports = router;
