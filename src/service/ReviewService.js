// const Review = require("../model/Review");

// class ReviewService {

//   // ===== GET REVIEW DASHBOARD DATA =====
//   async getReviewDashboard() {
//     try {

//       const totalReviews = await Review.countDocuments();

//       const avgResult = await Review.aggregate([
//         {
//           $group: {
//             _id: null,
//             avgRating: { $avg: "$rating" }
//           }
//         }
//       ]);

//       const averageRating = avgResult.length
//         ? avgResult[0].avgRating.toFixed(1)
//         : 0;

//       const productsReviewed = await Review.distinct("productId");

//       const latestReviews = await Review.find()
//         .populate("userId", "name")
//         .populate("productId", "name")
//         .sort({ createdAt: -1 })
//         .limit(5);

//       return {
//         totalReviews,
//         averageRating,
//         productsReviewed: productsReviewed.length,
//         latestReviews,
//       };

//     } catch (error) {
//       throw error;
//     }
//   }
// }

// module.exports = new ReviewService();








const Review = require("../model/Review");

class ReviewService {

  // ===== CREATE REVIEW =====
  async createReview(userId, productId, rating, comment) {

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    return review;
  }


  // ===== DASHBOARD REVIEWS =====
  async getReviewDashboard() {

    const totalReviews = await Review.countDocuments();

    // ⭐ Average rating
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

    // ⭐ Distinct products reviewed
    const productsReviewed = await Review.distinct("productId");

    // ⭐ Latest Reviews
    const latestReviews = await Review.find()
      .populate("userId", "name")
      .populate("productId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalReviews,
      averageRating,
      productsReviewed: productsReviewed.length,
      latestReviews,
    };
  }


  // ===== GET PRODUCT REVIEWS =====
  async getProductReviews(productId) {

    return await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
  }
}

module.exports = new ReviewService();
