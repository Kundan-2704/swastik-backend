




const router = require("express").Router();
const controller = require("../controller/NotificationController");

const auth = require("../middleware/authMiddleware");
const sellerAuth = require("../middleware/sellerAuthMiddleware"); 

/* ================= GET ================= */

router.get("/", auth, controller.getMyNotifications);

/* ================= SELLER SAFE VERSION 😈🔥 */

router.get("/seller", sellerAuth, controller.getMyNotifications); 

router.patch("/:id/read", auth, controller.markRead);
router.patch("/read-all", auth, controller.markAllRead);
router.delete("/", auth, controller.clearAll);

module.exports = router;