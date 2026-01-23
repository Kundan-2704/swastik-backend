const router = require("express").Router();
const SellerWalletController = require("../controller/SellerWalletController");
const sellerAuth = require("../middleware/sellerAuthMiddleware");

router.get("/", sellerAuth, SellerWalletController.getWalletSummary);

module.exports = router;
