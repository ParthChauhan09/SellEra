import Reviews from "../../models/reviewSchema.js";
import Products from "../../models/ProductSchema.js";
import Users from "../../models/UserSchema.js";

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Reviews.find({ product: productId })
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

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { star, review } = req.body;
    const userId = req.user._id;
    
    // Check if product exists
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Reviews.findOne({
      user: userId,
      product: productId
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this product"
      });
    }
    
    // Create new review
    const newReview = await Reviews.create({
      star,
      review,
      user: userId,
      product: productId
    });
    
    // Add review to product
    product.review.push(newReview._id);
    await product.save();
    
    // Add review to user
    const user = await Users.findById(userId);
    user.review.push(newReview._id);
    await user.save();
    
    // Populate user and product details
    const populatedReview = await Reviews.findById(newReview._id)
      .populate('user', 'name email')
      .populate('product', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { star, review } = req.body;
    const userId = req.user._id;
    
    // Find the review
    const existingReview = await Reviews.findById(reviewId);
    
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        error: "Review not found"
      });
    }
    
    // Check if user is the owner of the review
    if (existingReview.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this review"
      });
    }
    
    // Update review
    existingReview.star = star || existingReview.star;
    existingReview.review = review || existingReview.review;
    await existingReview.save();
    
    // Populate user and product details
    const populatedReview = await Reviews.findById(reviewId)
      .populate('user', 'name email')
      .populate('product', 'name');
    
    res.status(200).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;
    
    // Find the review
    const review = await Reviews.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found"
      });
    }
    
    // Check if user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this review"
      });
    }
    
    // Remove review from product
    await Products.findByIdAndUpdate(
      review.product,
      { $pull: { review: reviewId } }
    );
    
    // Remove review from user
    await Users.findByIdAndUpdate(
      userId,
      { $pull: { review: reviewId } }
    );
    
    // Delete the review
    await Reviews.findByIdAndDelete(reviewId);
    
    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const reviews = await Reviews.find({ user: userId })
      .populate('product', 'name image')
      .sort({ _id: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews
};
