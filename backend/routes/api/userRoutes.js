import express from "express";
const router = express.Router();
import userController from "../../controllers/api/userAuthController.js";
import { extractToken, isUserAPI } from "../../middleware/apiAuth.js";

// Apply token extraction middleware to all routes
router.use(extractToken);

// Register a new user
router.post("/register", userController.registerUser);

// Login user
router.post("/login", userController.loginUser);

// Get user profile (protected)
router.get("/profile", isUserAPI, userController.getUserProfile);

// Add product to cart (protected)
router.post("/cart/:id", isUserAPI, userController.addToCart);

// Get user's cart (protected)
router.get("/cart", isUserAPI, userController.getCart);

export default router;
