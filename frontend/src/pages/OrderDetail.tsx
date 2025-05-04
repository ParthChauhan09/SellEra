
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { orderApi } from '@/services/api';
import { ArrowLeft, Package, MapPin, User, CalendarClock } from 'lucide-react';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await orderApi.getOrderById(id);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <Separator className="my-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500 py-12">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="mb-6">{error || 'Order not found'}</p>
            <Link to="/orders">
              <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate totals
  const subtotal = order.orderProducts.reduce(
    (acc: number, product: any) => acc + product.price,
    0
  );
  const shipping = 0; // Free shipping
  const total = order.total;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/orders" className="flex items-center mb-6 text-sellera-purple hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Order #{order._id.substring(0, 8)}</h1>
          <Badge className="mt-2 md:mt-0 bg-sellera-purple">Completed</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items and Summary */}
          <div className="md:col-span-2">
            <Card className="shadow-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Order Items
                </h2>
                
                <div className="space-y-6">
                  {order.orderProducts.map((product: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={product.image?.url || '/placeholder.svg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <Link to={`/products/${product._id}`} className="font-medium hover:text-sellera-purple">
                          {product.name}
                        </Link>
                        <p className="text-gray-600 text-sm">{product.category}</p>
                      </div>
                      <div className="font-semibold">${product.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${typeof total === 'number' ? total.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Details */}
          <div>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <CalendarClock className="mr-2 h-4 w-4" />
                      Order Date
                    </h3>
                    <p>{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <User className="mr-2 h-4 w-4" />
                      Customer
                    </h3>
                    <p>
                      {typeof order.customer === 'object' 
                        ? order.customer.name 
                        : 'Customer information not available'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <MapPin className="mr-2 h-4 w-4" />
                      Shipping Address
                    </h3>
                    <p>
                      {/* In a real application, we'd show the shipping address here */}
                      123 Example Street<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
