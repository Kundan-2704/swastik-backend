





// const Review = require("../model/Review");

// class ReviewService {

//   // ===== CREATE REVIEW =====
//   async createReview(userId, productId, rating, comment) {

//     const review = await Review.create({
//       userId,
//       productId,
//       rating,
//       comment,
//     });

//     return review;
//   }


//   // ===== DASHBOARD REVIEWS =====
//   async getReviewDashboard() {

//     const totalReviews = await Review.countDocuments();

//     // ⭐ Average rating
//     const avg = await Review.aggregate([
//       {
//         $group: {
//           _id: null,
//           averageRating: { $avg: "$rating" }
//         }
//       }
//     ]);

//     const averageRating = avg.length
//       ? avg[0].averageRating.toFixed(1)
//       : 0;

//     // ⭐ Distinct products reviewed
//     const productsReviewed = await Review.distinct("productId");

//     // ⭐ Latest Reviews
//     const latestReviews = await Review.find()
//       .populate("userId", "name")
//       .populate("productId", "name")
//       .sort({ createdAt: -1 })
//       .limit(5);

//     return {
//       totalReviews,
//       averageRating,
//       productsReviewed: productsReviewed.length,
//       latestReviews,
//     };
//   }


//   // ===== GET PRODUCT REVIEWS =====
//   async getProductReviews(productId) {

//     return await Review.find({ productId })
//       .populate("userId", "name")
//       .sort({ createdAt: -1 });
//   }
// }

// module.exports = new ReviewService();




const Review = require("../model/Review");
const Order = require("../model/Order");
const OrderStatus = require("../domain/OrderStatus");

class ReviewService {

  async createReview(userId, productId, rating, comment) {

    /* ================= VALIDATION ================= */

    if (!productId || !rating || !comment) {
      throw new Error("All fields are required");
    }

    /* ================= DUPLICATE CHECK ================= */

    const existingReview = await Review.findOne({ userId, productId });

    if (existingReview) {
      throw new Error("You already reviewed this product");
    }

    /* ================= DELIVERY CHECK ================= */

    const deliveredOrder = await Order.findOne({
   user: userId,
   orderStatus: OrderStatus.DELIVERED,
   orderItems: { $exists: true, $ne: [] }   // optional safety
}).populate({
   path: "orderItems",
   match: { product: productId }
});

if (!deliveredOrder || deliveredOrder.orderItems.length === 0) {
   throw new Error("Review allowed only after delivery");
}

    /* ================= CREATE REVIEW ================= */

    return await Review.create({
      userId,
      productId,
      rating: Number(rating),   // ✅ normalize
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

    const latestReviews = await Review.find()
      .populate("userId", "name")
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

  async getProductReviews(productId) {

    return await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
  }
}

module.exports = new ReviewService();