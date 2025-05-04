import Orders from "../../models/OrderSchema.js";
import Users from "../../models/UserSchema.js";
import Products from "../../models/ProductSchema.js";
import Vendors from "../../models/VendorSchema.js";

// Create a new order from cart items
export const createOrder = async (req, res) => {
  try {
    // Get cart items from request body or session
    let cartItems = req.body.cartItems || req.session.cart || [];

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Your cart is empty. Please add items before checkout.",
      });
    }

    // Calculate total
    let total = 0;
    for (let item of cartItems) {
      const price = item.product.price || 0;
      const quantity = item.quantity || 1;
      total += price * quantity;
    }

    // Get product IDs from cart items
    const productIds = cartItems.map((item) => {
      // Handle both string IDs and object IDs
      return typeof item.product === "object" ? item.product._id : item.product;
    });

    // Create order
    const order = new Orders({
      orderProducts: productIds,
      customer: req.user._id,
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      total: total,
    });

    // Save order
    await order.save();

    // Add order to user's order history
    const user = await Users.findById(req.user._id);
    user.orderHistory.push(order._id);

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Clear session cart if it exists
    if (req.session && req.session.cart) {
      req.session.cart = [];
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's order history
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Orders.find({ customer: userId })
      .populate("orderProducts")
      .sort({ _id: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor's orders
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    // Find all products by this vendor
    const products = await Products.find({ vendorName: vendorId });

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Get product IDs
    const productIds = products.map((product) => product._id);

    // Find all orders containing these products
    const orders = await Orders.find({
      orderProducts: { $in: productIds },
    })
      .populate("customer", "name email")
      .populate("orderProducts")
      .sort({ _id: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Orders.findById(orderId)
      .populate("customer", "name email")
      .populate("orderProducts");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check if user is authorized to view this order
    const isCustomer =
      order.customer._id.toString() === req.user?._id?.toString();

    let isVendor = false;
    if (req.vendor) {
      // Check if any product in the order belongs to this vendor
      const vendorProducts = await Products.find({
        vendorName: req.vendor._id,
      });
      const vendorProductIds = vendorProducts.map((p) => p._id.toString());

      isVendor = order.orderProducts.some((p) =>
        vendorProductIds.includes(p._id.toString())
      );
    }

    if (!isCustomer && !isVendor) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  createOrder,
  getUserOrders,
  getVendorOrders,
  getOrderById,
};
