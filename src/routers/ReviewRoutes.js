// const express = require("express");
// const router = express.Router();

// const reviewController = require("../controller/ReviewController");

// router.get("/dashboard", reviewController.getReviews);

// module.exports = router;






const express = require("express");
const router = express.Router();

const reviewController = require("../controller/ReviewController");

// Dashboard
router.get("/dashboard", reviewController.getReviews);

// Create review
router.post("/", reviewController.createReview);

// Product reviews
router.get("/product/:productId", reviewController.getProductReviews);

module.exports = router;
