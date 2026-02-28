const Review = require("../model/Review");
const Order = require("../model/Order");
const OrderStatus = require("../domain/OrderStatus");
const mongoose = require("mongoose");

class ReviewService {


  async createReview(userId, productId, rating, comment) {

    if (!productId || !rating || !comment) {
      throw new Error("All fields are required");
    }

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      throw new Error("You already reviewed this product");
    }

    /* ================= DELIVERY CHECK ================= */

    // Convert to ObjectId for safe comparison
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Get all delivered orders of user
    const deliveredOrders = await Order.find({
      user: userId,
      orderStatus: OrderStatus.DELIVERED
    }).populate("orderItems");

    if (!deliveredOrders.length) {
      throw new Error("Review allowed only after delivery");
    }

    let productFound = false;

    for (const order of deliveredOrders) {
      for (const item of order.orderItems) {

        // Handle both populated and non-populated cases
        const itemProductId = item.product?._id
          ? item.product._id
          : item.product;

        if (itemProductId && itemProductId.toString() === productObjectId.toString()) {
          productFound = true;
          break;
        }
      }

      if (productFound) break;
    }

    if (!productFound) {
      throw new Error("Review allowed only after delivery");
    }

    /* ================= CREATE REVIEW ================= */

    return await Review.create({
      userId,
      productId: productObjectId,
      rating: Number(rating),
      comment
    });
  }

  /* ================= DASHBOARD ================= */

  async getReviewDashboard() {

    const totalReviews = await Review.countDocuments();

    const avg = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    const averageRating = avg.length
      ? avg[0].averageRating.toFixed(1)
      : 0;

    // const latestReviews = await Review.find()
    //   .populate("userId", "name")
    //   .populate("productId", "name")
    //   .sort({ createdAt: -1 })
    //   .limit(5);
const latestReviews = await Review.find()
  .populate("userId", "fullName email avatar")
  .populate("productId", "name")
  .sort({ createdAt: -1 })
  .limit(5);
    return {
      totalReviews,
      averageRating,
      latestReviews
    };
  }


  /* ================= PRODUCT REVIEWS ================= */

  // async getProductReviews(productId) {

  //   return await Review.find({ productId })
  //     .populate("userId", "name")
  //     .sort({ createdAt: -1 });
  // }
  async getProductReviews(productId) {
  return await Review.find({ productId })
    .populate("userId", "fullName email avatar")
    .sort({ createdAt: -1 });
}
}

module.exports = new ReviewService();