import express from "express";
const router = express.Router();

import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";
import vendorRoutes from "./vendorRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import orderRoutes from "./orderRoutes.js";

// Mount API routes
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/vendors", vendorRoutes);
router.use("/reviews", reviewRoutes);
router.use("/orders", orderRoutes);

export default router;
