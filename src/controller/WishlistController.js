const WishlistService = require("../service/WishlistService");

class WishlistController {
  /* ✅ Toggle */
  static async toggleWishlist(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID required",
        });
      }

      const result = await WishlistService.toggleWishlist(userId, productId);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /* ✅ Get Wishlist */
  static async getWishlist(req, res) {
    try {
      const userId = req.user._id;

      const wishlist = await WishlistService.getUserWishlist(userId);

      res.json({
        success: true,
        wishlist,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /* ✅ Check */
  static async checkWishlist(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;

      const wished = await WishlistService.checkWishlist(userId, productId);

      res.json({
        success: true,
        wished,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = WishlistController;