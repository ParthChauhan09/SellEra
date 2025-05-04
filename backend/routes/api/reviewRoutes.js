import express from "express";
const router = express.Router();
import reviewController from "../../controllers/api/reviewController.js";
import { extractToken, isUserAPI } from "../../middleware/apiAuth.js";

// Apply token extraction middleware to all routes
router.use(extractToken);

// Get all reviews for a product
router.get("/product/:productId", reviewController.getProductReviews);

// Create a new review (protected)
router.post("/product/:productId", isUserAPI, reviewController.createReview);

// Update a review (protected)
router.put("/:reviewId", isUserAPI, reviewController.updateReview);

// Delete a review (protected)
router.delete("/:reviewId", isUserAPI, reviewController.deleteReview);

// Get user's reviews (protected)
router.get("/user", isUserAPI, reviewController.getUserReviews);

export default router;
