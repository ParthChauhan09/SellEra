
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { orderApi } from '@/services/api';
import { Trash, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { cart, totalItems, totalPrice, addToCart, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsCheckingOut(true);
    try {
      await orderApi.createOrder();
      
      // Clear cart after successful order
      clearCart();
      
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const updateQuantity = (productId: string, currentQuantity: number, change: number) => {
    const product = cart.find(item => item.product._id === productId)?.product;
    if (!product) return;
    
    const newQuantity = currentQuantity + change;
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      // Remove current item and add with new quantity
      removeFromCart(productId);
      addToCart(product, newQuantity);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
        <p className="text-gray-600 mb-8">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
        </p>

        {cart.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart Items */}
            <div className="md:w-2/3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.product._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 relative bg-gray-100 rounded">
                            <img 
                              src={item.product.image?.url || '/placeholder.svg'} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div>
                            <Link 
                              to={`/products/${item.product._id}`}
                              className="font-medium hover:text-sellera-purple"
                            >
                              {item.product.name}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center border rounded-md max-w-[120px]">
                          <button 
                            className="px-2 py-1 border-r"
                            onClick={() => updateQuantity(item.product._id, item.quantity, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 min-w-[30px] text-center">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 border-l"
                            onClick={() => updateQuantity(item.product._id, item.quantity, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>${item.product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-end mt-6">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="md:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-sellera-purple hover:bg-sellera-purple-dark"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    'Processing...'
                  ) : (
                    <>
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <div className="mt-6 text-center">
                  <Link 
                    to="/products"
                    className="text-sellera-purple hover:underline flex items-center justify-center"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6 text-gray-400">
              <ShoppingBag className="mx-auto h-16 w-16" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding items to your cart!</p>
            <Link to="/products">
              <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
