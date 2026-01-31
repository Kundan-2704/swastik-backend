// routers/PackingSlipRoutes.js
const express = require("express");
const PackingSlipController = require("../controller/PackingSlipController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/seller/orders/:orderId/packing-slip",
  auth,
  PackingSlipController.download
);

module.exports = router;
