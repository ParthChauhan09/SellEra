import jwt from "jsonwebtoken";
import Users from "../models/UserSchema.js";
import Vendors from "../models/VendorSchema.js";
import { JWT_SECRET } from "../config/keys.js";

// Middleware to extract token from Authorization header
export const extractToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    req.token = token;
  } else if (req.cookies && req.cookies.token) {
    // Fallback to cookie if no Authorization header
    req.token = req.cookies.token;
  }
  
  next();
};

// Middleware to authenticate API requests
export const authenticateAPI = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please provide a valid token."
      });
    }
    
    const decoded = jwt.verify(req.token, JWT_SECRET);
    
    if (decoded.isVendor) {
      // Vendor authentication
      const vendor = await Vendors.findOne({ email: decoded.email });
      
      if (!vendor) {
        return res.status(401).json({
          success: false,
          error: "Invalid token. Vendor not found."
        });
      }
      
      req.vendor = vendor;
      req.isVendor = true;
    } else {
      // User authentication
      const user = await Users.findOne({ email: decoded.email });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid token. User not found."
        });
      }
      
      req.user = user;
      req.isUser = true;
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token."
    });
  }
};

// Middleware to check if user is authenticated
export const isUserAPI = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please provide a valid token."
      });
    }
    
    const decoded = jwt.verify(req.token, JWT_SECRET);
    
    // Check if token is for a user (not a vendor)
    if (decoded.isVendor) {
      return res.status(403).json({
        success: false,
        error: "Access denied. User privileges required."
      });
    }
    
    const user = await Users.findOne({ email: decoded.email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token. User not found."
      });
    }
    
    req.user = user;
    req.isUser = true;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token."
    });
  }
};

// Middleware to check if vendor is authenticated
export const isVendorAPI = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please provide a valid token."
      });
    }
    
    const decoded = jwt.verify(req.token, JWT_SECRET);
    
    // Check if token is for a vendor
    if (!decoded.isVendor) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Vendor privileges required."
      });
    }
    
    const vendor = await Vendors.findOne({ email: decoded.email });
    
    if (!vendor) {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Vendor not found."
      });
    }
    
    req.vendor = vendor;
    req.isVendor = true;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token."
    });
  }
};

export default {
  extractToken,
  authenticateAPI,
  isUserAPI,
  isVendorAPI
};
