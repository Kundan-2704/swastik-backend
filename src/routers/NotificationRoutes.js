




const router = require("express").Router();
const controller = require("../controller/NotificationController");

const auth = require("../middleware/authMiddleware");
const sellerAuth = require("../middleware/sellerAuthMiddleware"); 

const admin = require("../config/firebaseAdmin");

/* ================= GET ================= */

router.get("/", auth, controller.getMyNotifications);

/* ================= SELLER SAFE VERSION 😈🔥 */

router.get("/seller", sellerAuth, controller.getMyNotifications); 

router.patch("/:id/read", auth, controller.markRead);
router.patch("/read-all", auth, controller.markAllRead);
router.delete("/", auth, controller.clearAll);




router.post("/push", async (req, res) => {

  const { token, title, body } = req.body;

  try {

    const message = {
      notification: {
        title: title,
        body: body
      },
      token: token
    };

    const response = await admin.messaging().send(message);

    res.send({
      success: true,
      response
    });

  } catch (error) {

    console.error(error);

    res.status(500).send({
      success: false,
      error
    });

  }

});


// ✅ YEH ROUTE ADD KARO
router.post("/fcm-token", auth, async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token required" });
    }

    await User.findByIdAndUpdate(req.user._id, { fcmToken });

    res.json({ success: true, message: "FCM token saved ✅" });
  } catch (err) {
    console.error("FCM token save error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;