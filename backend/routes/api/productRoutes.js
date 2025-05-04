import express from "express";
const router = express.Router();
import * as productController from "../../controllers/api/productController.js";
import { extractToken, isVendorAPI } from "../../middleware/apiAuth.js";
import multer from "multer";

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply token extraction middleware to all routes
router.use(extractToken);

// Middleware to validate category
const isCategory = (req, res, next) => {
  let { category } = req.params;
  let validCategories = ["Electronics", "Clothing", "Accessories"];

  if (validCategories.includes(category)) {
    return next();
  }

  return res.status(400).json({
    success: false,
    error:
      "Invalid category. Must be one of: Electronics, Clothing, Accessories",
  });
};

// Get all products
router.get("/", productController.getAllProducts);

// Get products by category
router.get(
  "/category/:category",
  isCategory,
  productController.getProductsByCategory
);

// Get product by ID
router.get("/:id", productController.getProductById);

// Create a new product (vendor only)
router.post(
  "/",
  isVendorAPI,
  upload.single("product[image]"),
  productController.createProduct
);

// Update a product (vendor only)
router.put(
  "/:id",
  isVendorAPI,
  upload.single("product[image]"),
  productController.updateProduct
);

// Delete a product (vendor only)
router.delete("/:id", isVendorAPI, productController.deleteProduct);

export default router;
