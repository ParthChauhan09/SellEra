import Products from "../../models/ProductSchema.js";
import Vendors from "../../models/VendorSchema.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/keys.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Products.find({ category: category });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findById(id).populate({
      path: "review",
      populate: {
        path: "user",
        model: "Users",
        select: "-password" // Exclude password
      },
    }).populate({
      path: "vendorName",
      select: "name email description" // Only include necessary fields
    });
    
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { product } = req.body;
    const vendor = req.cookies.token;
    const vendorToken = jwt.verify(vendor, JWT_SECRET);
    const findvendor = await Vendors.findOne({ email: vendorToken.email });
    
    if (!findvendor) {
      return res.status(404).json({ success: false, error: "Vendor not found" });
    }
    
    const createdProduct = await Products.create(product);
    
    if (req.file) {
      createdProduct.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }
    
    await createdProduct.save();
    findvendor.productList.push(createdProduct._id);
    createdProduct.vendorName = findvendor._id;
    await findvendor.save();
    await createdProduct.save();
    
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product } = req.body;
    
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { ...product },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    
    if (req.file) {
      updatedProduct.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      await updatedProduct.save();
    }
    
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Products.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
