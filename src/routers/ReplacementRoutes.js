const express = require("express");
const router = express.Router();
const controller = require("../controller/ReplacementController");

// middleware examples
const auth = require("../middleware/authMiddleware");
const sellerAuth = require("../middleware/sellerAuthMiddleware");
const adminAuth = require("../middleware/adminAuthMiddleware");

/* CUSTOMER */
router.post("/request", auth, controller.request);

/* SELLER */
router.patch("/approve/:orderId", sellerAuth, controller.approve);
router.patch("/reject/:orderId", sellerAuth, controller.reject);
router.patch("/pickup/:orderId", sellerAuth, controller.pickup);
router.patch("/ship/:orderId", sellerAuth, controller.ship);

/* ADMIN */
router.patch("/deliver/:orderId", adminAuth, controller.deliver);
router.patch("/complete/:orderId", adminAuth, controller.complete);

module.exports = router;
