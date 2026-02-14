





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
