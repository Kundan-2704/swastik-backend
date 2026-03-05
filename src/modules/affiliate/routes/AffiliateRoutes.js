// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/AffiliateController");
// const authMiddleware = require("../../../middleware/authMiddleware");

// router.post("/register", authMiddleware, controller.register);
// router.get("/dashboard", authMiddleware, controller.dashboard);
// router.post("/withdraw", authMiddleware, controller.withdraw);

// module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/AffiliateController");
const auth = require("../../../middleware/authMiddleware");
const affiliateOnly = require("../middleware/AfiiliateOnly");

router.post("/register", auth, controller.register);
router.get("/dashboard", auth, affiliateOnly, controller.dashboard);
router.post("/withdraw", auth, affiliateOnly, controller.withdraw);

// admin
router.put("/withdraw/:id/approve", auth, controller.approveWithdrawal);

module.exports = router;