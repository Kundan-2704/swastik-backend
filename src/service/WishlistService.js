const Wishlist = require("../model/WishlistModel");

class WishlistService {
  /* ✅ Toggle Wishlist */
  static async toggleWishlist(userId, productId) {
    const existing = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (existing) {
      await existing.deleteOne();
      return {
        wished: false,
        message: "Removed from wishlist",
      };
    }

    await Wishlist.create({
      user: userId,
      product: productId,
    });

    return {
      wished: true,
      message: "Added to wishlist",
    };
  }

  /* ✅ Get Wishlist */
  static async getUserWishlist(userId) {
    return await Wishlist.find({ user: userId }).populate("product");
  }

  /* ✅ Check Wishlist */
  static async checkWishlist(userId, productId) {
    const exists = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    return !!exists;
  }
}

module.exports = WishlistService;