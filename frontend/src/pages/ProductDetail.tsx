
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Product, Review } from '@/types';
import { productApi, reviewApi } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import StarRating from '@/components/StarRating';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useCart();
  const { authUser, isAuthenticated } = useAuth();

  // Fetch product and reviews
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productResponse = await productApi.getProductById(id);
        setProduct(productResponse.data);
        
        const reviewsResponse = await reviewApi.getProductReviews(id);
        setReviews(reviewsResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }
    
    if (!id) return;
    
    setSubmittingReview(true);
    try {
      await reviewApi.createReview(id, {
        star: reviewRating,
        review: reviewText
      });
      
      // Refresh reviews
      const reviewsResponse = await reviewApi.getProductReviews(id);
      setReviews(reviewsResponse.data);
      
      // Reset form
      setReviewText('');
      setReviewRating(5);
      
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.star, 0) / reviews.length 
    : 0;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="bg-gray-200 aspect-square rounded-lg"></div>
              </div>
              <div className="md:w-1/2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500 py-12">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="mb-6">{error || 'Product not found'}</p>
            <Link to="/products">
              <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden border">
              <img 
                src={product.image?.url || '/placeholder.svg'} 
                alt={product.name} 
                className="w-full h-auto object-contain aspect-square"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Ratings */}
            <div className="flex items-center mb-6">
              <StarRating rating={Math.round(averageRating)} />
              <span className="ml-2 text-gray-600">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            {/* Price */}
            <p className="text-2xl font-bold text-sellera-purple mb-4">
              ${product.price.toFixed(2)}
            </p>
            
            {/* Vendor */}
            <div className="mb-6">
              <p className="text-gray-600">
                Sold by: {
                  typeof product.vendorName === 'object' 
                    ? product.vendorName.name 
                    : 'Unknown Vendor'
                }
              </p>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4 text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-2 border-r"
                  onClick={decreaseQuantity}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  className="px-3 py-2 border-l"
                  onClick={increaseQuantity}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-sellera-purple hover:bg-sellera-purple-dark"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            {/* Additional info */}
            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-2">Category</h3>
              <Link 
                to={`/products/category/${product.category}`}
                className="text-sellera-purple hover:underline"
              >
                {product.category}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="vendor">Vendor</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="details">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p>{product.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  
                  {/* Review Form */}
                  {authUser.role === 'user' && (
                    <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                      <h4 className="text-lg font-medium mb-4">Write a Review</h4>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2">Rating</label>
                          <StarRating 
                            rating={reviewRating} 
                            onChange={setReviewRating} 
                            size={24}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="review" className="block text-gray-700 mb-2">
                            Your Review
                          </label>
                          <Textarea
                            id="review"
                            placeholder="Share your experience with this product..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="bg-sellera-purple hover:bg-sellera-purple-dark"
                          disabled={submittingReview || !isAuthenticated}
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </form>
                    </div>
                  )}
                  
                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">
                                {typeof review.user === 'object' ? review.user.name : 'Anonymous'}
                              </div>
                              <StarRating rating={review.star} size={16} />
                            </div>
                            <span className="text-gray-500 text-sm">
                              {/* If we had dates, we'd format them here */}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="vendor">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About the Seller</h3>
                  {typeof product.vendorName === 'object' ? (
                    <div>
                      <h4 className="text-lg font-medium mb-2">{product.vendorName.name}</h4>
                      <p className="mb-4">{product.vendorName.description}</p>
                      {/* If we had more vendor details, we'd show them here */}
                    </div>
                  ) : (
                    <p className="text-gray-500">Vendor information not available</p>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
