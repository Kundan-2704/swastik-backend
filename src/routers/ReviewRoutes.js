





// const express = require("express");
// const router = express.Router();

// const reviewController = require("../controller/ReviewController");

// // Dashboard
// router.get("/dashboard", reviewController.getReviews);

// // Create review
// router.post("/", reviewController.createReview);

// // Product reviews
// router.get("/product/:productId", reviewController.getProductReviews);

// module.exports = router;





const express = require("express");
const router = express.Router();

const reviewController = require("../controller/ReviewController");
const auth = require("../middleware/authMiddleware");   // ✅ IMPORTANT


// ===== DASHBOARD REVIEWS =====
router.get("/dashboard", reviewController.getReviews);


// ===== CREATE REVIEW =====
// ✅ Only logged-in users
router.post("/", auth, reviewController.createReview);


// ===== PRODUCT REVIEWS =====
router.get("/product/:productId", reviewController.getProductReviews);


module.exports = router;