
import { Product, Review, ApiResponse, ErrorResponse } from '@/types';

const BASE_URL = 'http://localhost:3002/api';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!data.success) {
    throw new Error((data as ErrorResponse).error || 'An error occurred');
  }
  
  return data as T;
};

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const productApi = {
  // Get all products
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${BASE_URL}/products`);
    return handleResponse<ApiResponse<Product[]>>(response);
  },
  
  // Get products by category
  getProductsByCategory: async (category: string): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    return handleResponse<ApiResponse<Product[]>>(response);
  },
  
  // Get product by ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return handleResponse<ApiResponse<Product>>(response);
  },
  
  // Create product (vendor only)
  createProduct: async (productData: FormData): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
      },
      body: productData
    });
    return handleResponse<ApiResponse<Product>>(response);
  },
  
  // Update product (vendor only)
  updateProduct: async (id: string, productData: FormData): Promise<ApiResponse<Product>> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader()
      },
      body: productData
    });
    return handleResponse<ApiResponse<Product>>(response);
  },
  
  // Delete product (vendor only)
  deleteProduct: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<{}>>(response);
  }
};

export const reviewApi = {
  // Get product reviews
  getProductReviews: async (productId: string): Promise<ApiResponse<Review[]>> => {
    const response = await fetch(`${BASE_URL}/reviews/product/${productId}`);
    return handleResponse<ApiResponse<Review[]>>(response);
  },
  
  // Create review
  createReview: async (productId: string, reviewData: { star: number, review: string }): Promise<ApiResponse<Review>> => {
    const response = await fetch(`${BASE_URL}/reviews/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reviewData)
    });
    return handleResponse<ApiResponse<Review>>(response);
  },
  
  // Update review
  updateReview: async (reviewId: string, reviewData: { star: number, review: string }): Promise<ApiResponse<Review>> => {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reviewData)
    });
    return handleResponse<ApiResponse<Review>>(response);
  },
  
  // Delete review
  deleteReview: async (reviewId: string): Promise<ApiResponse<{}>> => {
    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<{}>>(response);
  },
  
  // Get user reviews
  getUserReviews: async (): Promise<ApiResponse<Review[]>> => {
    const response = await fetch(`${BASE_URL}/reviews/user`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<Review[]>>(response);
  }
};

export const orderApi = {
  // Create order (checkout)
  createOrder: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // Get user order history
  getUserOrderHistory: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${BASE_URL}/orders/history`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },
  
  // Get vendor orders
  getVendorOrders: async (): Promise<ApiResponse<any[]>> => {
    const response = await fetch(`${BASE_URL}/orders/vendor`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },
  
  // Get order by ID
  getOrderById: async (orderId: string): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<any>>(response);
  }
};

export const vendorApi = {
  // Get vendor profile
  getVendorProfile: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/vendors/profile`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // Get vendor products
  getVendorProducts: async (): Promise<ApiResponse<Product[]>> => {
    const response = await fetch(`${BASE_URL}/vendors/products`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<Product[]>>(response);
  },
  
  // Update vendor profile
  updateVendorProfile: async (id: string, profileData: FormData): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/vendors/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader()
      },
      body: profileData
    });
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // Delete vendor account
  deleteVendorAccount: async (): Promise<ApiResponse<any>> => {
    const response = await fetch(`${BASE_URL}/vendors`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<any>>(response);
  },
  
  // Get vendor reviews
  getVendorReviews: async (): Promise<ApiResponse<Review[]>> => {
    const response = await fetch(`${BASE_URL}/vendors/reviews`, {
      headers: {
        ...getAuthHeader()
      }
    });
    return handleResponse<ApiResponse<Review[]>>(response);
  }
};
