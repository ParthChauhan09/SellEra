import express from "express";
const router = express.Router();
import orderController from "../../controllers/api/orderController.js";
import {
  extractToken,
  isUserAPI,
  isVendorAPI,
  authenticateAPI,
} from "../../middleware/apiAuth.js";

// Apply token extraction middleware to all routes
router.use(extractToken);

// Create a new order (protected - user)
router.post("/checkout", isUserAPI, orderController.createOrder);

// Get user's order history (protected - user)
router.get("/history", isUserAPI, orderController.getUserOrders);

// Get vendor's orders (protected - vendor)
router.get("/vendor", isVendorAPI, orderController.getVendorOrders);

// Get order by ID (protected - user or vendor)
router.get("/:orderId", authenticateAPI, orderController.getOrderById);

export default router;
