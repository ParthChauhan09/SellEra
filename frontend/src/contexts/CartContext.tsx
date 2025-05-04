
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product, CartItem, Cart } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = useAuth();

  // Calculate total items and price
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Fetch the cart when user logs in
  useEffect(() => {
    if (authUser.token && authUser.role === 'user') {
      fetchCart();
    } else {
      // If user logs out, clear the cart
      setCart([]);
    }
  }, [authUser.token, authUser.role]);

  const fetchCart = async () => {
    if (!authUser.token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3002/api/users/cart', {
        headers: {
          'Authorization': `Bearer ${authUser.token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCart(data.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Could not load your cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    setIsLoading(true);
    
    try {
      if (authUser.token && authUser.role === 'user') {
        // Add to API cart if user is logged in
        const response = await fetch(`http://localhost:3002/api/users/cart/${product._id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authUser.token}`,
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          await fetchCart(); // Refresh the cart from the API
          toast.success('Added to cart!');
        } else {
          toast.error('Could not add item to cart');
        }
      } else {
        // Handle local cart for non-logged-in users
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.product._id === product._id);
        
        if (existingItemIndex !== -1) {
          // Update quantity if product exists
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += quantity;
          setCart(updatedCart);
        } else {
          // Add new item if product doesn't exist in cart
          setCart(prev => [...prev, { product, quantity }]);
        }
        
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Could not add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
