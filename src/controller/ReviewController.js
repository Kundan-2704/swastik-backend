// const reviewService = require("../service/ReviewService");

// class ReviewController {

//   async getReviews(req, res) {
//     try {

//       const data = await reviewService.getReviewDashboard();

//       res.status(200).json({
//         success: true,
//         data,
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   }
// }

// module.exports = new ReviewController();









const reviewService = require("../service/ReviewService");

class ReviewController {

  // ===== CREATE REVIEW =====
  async createReview(req, res) {
    try {

      const { productId, rating, comment } = req.body;
      const userId = req.user.id;

      const review = await reviewService.createReview(
        userId,
        productId,
        rating,
        comment
      );

      res.status(201).json({
        success: true,
        review
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


  // ===== DASHBOARD =====
  async getReviews(req, res) {
    try {

      const data = await reviewService.getReviewDashboard();

      res.json({
        success: true,
        data
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }


  // ===== PRODUCT REVIEWS =====
  async getProductReviews(req, res) {
    try {

      const { productId } = req.params;

      const reviews = await reviewService.getProductReviews(productId);

      res.json({
        success: true,
        reviews
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ReviewController();
