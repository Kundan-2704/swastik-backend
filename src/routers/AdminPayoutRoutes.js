const router = require("express").Router();
const AdminPayoutController = require("../controller/AdminPayoutController");
const adminAuth = require("../middleware/adminAuthMiddleware");

router.get("/", adminAuth, AdminPayoutController.getAllPayouts);
router.put("/:payoutId", adminAuth, AdminPayoutController.updatePayoutStatus);

module.exports = router;
