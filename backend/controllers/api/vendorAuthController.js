import Vendors from "../../models/VendorSchema.js";
import Products from "../../models/ProductSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Reviews from "../../models/reviewSchema.js";
import vendorValidationSchema from "../../utility/validateVendor.js";
import { JWT_SECRET } from "../../config/keys.js";

// Register a new vendor
export const registerVendor = async (req, res) => {
  try {
    let { vendor } = req.body;
    
    // Remove confirmPassword if it exists
    if (vendor.confirmPassword) {
      delete vendor.confirmPassword;
    }

    // Validate vendor data
    try {
      vendorValidationSchema.validate(vendor);
    } catch (validationError) {
      return res.status(400).json({ 
        success: false, 
        error: validationError.message 
      });
    }

    // Check if vendor already exists
    const existingVendor = await Vendors.findOne({ email: vendor.email });
    if (existingVendor) {
      return res.status(400).json({ 
        success: false, 
        error: "Vendor with this email already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(vendor.password, salt);

    // Create new vendor
    const newVendor = await Vendors.create(vendor);

    // Generate JWT token
    const token = jwt.sign(
      { email: newVendor.email, isVendor: true },
      JWT_SECRET
    );

    // Remove password from response
    const vendorResponse = newVendor.toObject();
    delete vendorResponse.password;

    res.status(201).json({
      success: true,
      token,
      data: vendorResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login vendor
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find vendor
    const vendor = await Vendors.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, vendor.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: vendor.email, isVendor: true },
      JWT_SECRET
    );

    // Remove password from response
    const vendorResponse = vendor.toObject();
    delete vendorResponse.password;

    res.status(200).json({
      success: true,
      token,
      data: vendorResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor profile
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendors.findById(req.vendor._id)
      .select('-password')
      .populate('productList');
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: "Vendor not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor products
export const getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendors.findById(req.vendor._id)
      .populate('productList');
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: "Vendor not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: vendor.productList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update vendor profile
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent password update through this endpoint
    if (updates.password) {
      delete updates.password;
    }
    
    const vendor = await Vendors.findById(id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: "Vendor not found" 
      });
    }
    
    // Check if vendor is the same as authenticated vendor
    if (vendor._id.toString() !== req.vendor._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: "Not authorized to update this profile" 
      });
    }
    
    // Update vendor fields
    Object.keys(updates).forEach(key => {
      vendor[key] = updates[key];
    });
    
    // Handle image upload if present
    if (req.file) {
      vendor.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }
    
    await vendor.save();
    
    // Remove password from response
    const vendorResponse = vendor.toObject();
    delete vendorResponse.password;
    
    res.status(200).json({
      success: true,
      data: vendorResponse
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete vendor account
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendors.findById(req.vendor._id);
    
    if (!vendor) {
      return res.status(404).json({ 
        success: false, 
        error: "Vendor not found" 
      });
    }
    
    await Vendors.findByIdAndDelete(req.vendor._id);
    
    res.status(200).json({
      success: true,
      message: "Vendor account deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get vendor reviews
export const getVendorReviews = async (req, res) => {
  try {
    // Find all products by this vendor
    const products = await Products.find({ vendorName: req.vendor._id });
    
    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Get product IDs
    const productIds = products.map(product => product._id);
    
    // Find all reviews for these products
    const reviews = await Reviews.find({ product: { $in: productIds } })
      .populate('user', 'name email')
      .populate('product', 'name');
    
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  registerVendor,
  loginVendor,
  getVendorProfile,
  getVendorProducts,
  updateVendor,
  deleteVendor,
  getVendorReviews
};
