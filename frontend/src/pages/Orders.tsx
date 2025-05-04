
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { orderApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingBag, Package, ArrowRight } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        let response;
        
        if (authUser.role === 'user') {
          response = await orderApi.getUserOrderHistory();
        } else if (authUser.role === 'vendor') {
          response = await orderApi.getVendorOrders();
        } else {
          throw new Error('Unauthorized');
        }
        
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    if (authUser.token) {
      fetchOrders();
    }
  }, [authUser.token, authUser.role]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {authUser.role === 'vendor' ? 'Vendor Orders' : 'Your Orders'}
        </h1>
        <p className="text-gray-600 mb-8">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </p>

        {error && (
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-sellera-purple hover:bg-sellera-purple-dark"
            >
              Try Again
            </Button>
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="mb-6 text-gray-400">
              <ShoppingBag className="mx-auto h-16 w-16" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              {authUser.role === 'vendor' 
                ? "You haven't received any orders yet." 
                : "You haven't placed any orders yet."}
            </p>
            {authUser.role === 'user' && (
              <Link to="/products">
                <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
                  Start Shopping
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-lg">Order #{order._id.substring(0, 8)}</h3>
                        <Badge className="ml-3 bg-sellera-purple">Completed</Badge>
                      </div>
                      <p className="text-gray-600">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {order.orderProducts.slice(0, 4).map((product: any, index: number) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={product.image?.url || '/placeholder.svg'} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-gray-600">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}

                    {order.orderProducts.length > 4 && (
                      <div className="col-span-1 md:col-span-2 mt-2">
                        <p className="text-gray-600">
                          +{order.orderProducts.length - 4} more items
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Link to={`/orders/${order._id}`}>
                      <Button variant="outline" className="border-sellera-purple text-sellera-purple hover:bg-sellera-purple-light hover:text-sellera-purple-dark">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
