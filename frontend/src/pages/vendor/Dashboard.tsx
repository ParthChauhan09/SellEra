
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vendorApi, productApi, orderApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Package, StarIcon, List, ShoppingBag, Edit, Trash } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VendorDashboard: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { authUser } = useAuth();

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!authUser.token || authUser.role !== 'vendor') return;
      
      setLoading(true);
      try {
        // Fetch products
        const productsResponse = await vendorApi.getVendorProducts();
        setProducts(productsResponse.data);
        
        // Fetch orders
        const ordersResponse = await orderApi.getVendorOrders();
        setOrders(ordersResponse.data);
        
        // Fetch reviews
        const reviewsResponse = await vendorApi.getVendorReviews();
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        toast.error('Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [authUser.token, authUser.role]);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await productApi.deleteProduct(productToDelete);
      
      // Remove the deleted product from the list
      setProducts(products.filter(product => product._id !== productToDelete));
      
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
      setProductToDelete(null);
    }
  };

  if (!authUser.user || authUser.role !== 'vendor') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">You need to be logged in as a vendor to access this page</h1>
          <Link to="/login">
            <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
              Go to Login
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-gray-600">Manage your products, orders, and reviews</p>
          </div>
          <Link to="/vendor/products/new">
            <Button className="mt-4 md:mt-0 bg-sellera-purple hover:bg-sellera-purple-dark">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-sellera-purple bg-opacity-10 rounded-md">
                  <Package className="h-8 w-8 text-sellera-purple" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Products</p>
                  <h3 className="text-2xl font-bold">{products.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-sellera-yellow bg-opacity-20 rounded-md">
                  <ShoppingBag className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Orders</p>
                  <h3 className="text-2xl font-bold">{orders.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-sellera-blue bg-opacity-10 rounded-md">
                  <StarIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Reviews</p>
                  <h3 className="text-2xl font-bold">{reviews.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">
              <Package className="mr-2 h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <StarIcon className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>My Products</CardTitle>
                <CardDescription>Manage your products inventory</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="py-4 border-b">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                <img 
                                  src={product.image?.url || '/placeholder.svg'} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Link to={`/vendor/products/edit/${product._id}`}>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => setProductToDelete(product._id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your product.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        className="bg-red-500 hover:bg-red-600"
                                        onClick={handleDeleteProduct}
                                        disabled={deleteLoading}
                                      >
                                        {deleteLoading ? 'Deleting...' : 'Delete'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <List className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-2">No products yet</h3>
                    <p className="text-gray-500 mb-4">Start adding products to your store!</p>
                    <Link to="/vendor/products/new">
                      <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
                        Add Your First Product
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="py-4 border-b">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>#{order._id.substring(0, 8)}</TableCell>
                            <TableCell>
                              {typeof order.customer === 'object' ? order.customer.name : 'Unknown'}
                            </TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Link to={`/orders/${order._id}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500">Orders will appear here when customers make purchases.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Product Reviews</CardTitle>
                <CardDescription>See what customers are saying about your products</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="py-4 border-b">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b pb-6">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden mr-3">
                            <img 
                              src={review.product.image?.url || '/placeholder.svg'} 
                              alt={review.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{review.product.name}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon 
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          By {typeof review.user === 'object' ? review.user.name : 'Anonymous'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                    <p className="text-gray-500">Reviews will appear here when customers leave feedback.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VendorDashboard;
