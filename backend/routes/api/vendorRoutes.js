import express from "express";
const router = express.Router();
import vendorController from "../../controllers/api/vendorAuthController.js";
import { extractToken, isVendorAPI } from "../../middleware/apiAuth.js";
import multer from "multer";

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply token extraction middleware to all routes
router.use(extractToken);

// Register a new vendor
router.post("/register", vendorController.registerVendor);

// Login vendor
router.post("/login", vendorController.loginVendor);

// Get vendor profile (protected)
router.get("/profile", isVendorAPI, vendorController.getVendorProfile);

// Get vendor products (protected)
router.get("/products", isVendorAPI, vendorController.getVendorProducts);

// Update vendor profile (protected)
router.put(
  "/:id",
  isVendorAPI,
  upload.single("image"),
  vendorController.updateVendor
);

// Delete vendor account (protected)
router.delete("/", isVendorAPI, vendorController.deleteVendor);

// Get vendor reviews (protected)
router.get("/reviews", isVendorAPI, vendorController.getVendorReviews);

export default router;
