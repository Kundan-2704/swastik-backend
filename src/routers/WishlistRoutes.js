const express = require("express");
const router = express.Router();

const WishlistController = require("../controller/WishlistController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/toggle", authMiddleware, WishlistController.toggleWishlist);
router.get("/", authMiddleware, WishlistController.getWishlist);
router.get("/check/:productId", authMiddleware, WishlistController.checkWishlist);

module.exports = router;