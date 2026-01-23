const router = require("express").Router();
const SellerPayoutController = require("../controller/SellerPayoutController");
const sellerAuth = require("../middleware/sellerAuthMiddleware");

router.post("/request", sellerAuth, SellerPayoutController.requestPayout);
router.get("/", sellerAuth, SellerPayoutController.getMyPayouts);

module.exports = router;
