import Users from "../../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Products from "../../models/ProductSchema.js";
import userValidationSchema from "../../utility/validateUser.js";
import { JWT_SECRET } from "../../config/keys.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    let { user } = req.body;
    
    // Remove confirmPassword if it exists
    if (user.confirmPassword) {
      delete user.confirmPassword;
    }

    // Validate user data
    try {
      userValidationSchema.validate(user);
    } catch (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError.message 
      });
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: "User with this email already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Create new user
    const newUser = await Users.create(user);

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id)
      .select('-password')
      .populate('cart')
      .populate('orderHistory')
      .populate('review');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const userId = req.user._id;

    // Find product
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: "Product not found" 
      });
    }

    // Add to user's cart
    const user = await Users.findById(userId);
    
    // Check if product is already in cart
    if (user.cart.includes(id)) {
      return res.status(400).json({ 
        success: false, 
        error: "Product already in cart" 
      });
    }

    user.cart.push(id);
    await user.save();

    // Add to session cart as well
    if (!req.session.cart) {
      req.session.cart = [];
    }

    req.session.cart.push({
      product: product,
      quantity: 1
    });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: {
        cart: user.cart,
        sessionCart: req.session.cart
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    // Get cart from session
    let products = req.session.cart;

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          products: [],
          total: 0
        }
      });
    }

    // Calculate total
    let total = 0;
    for (let item of products) {
      total += item.product.price * item.quantity;
    }

    res.status(200).json({
      success: true,
      data: {
        products,
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  addToCart,
  getCart
};
