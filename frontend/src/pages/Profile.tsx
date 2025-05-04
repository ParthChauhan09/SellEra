
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviewApi } from '@/services/api';
import StarRating from '@/components/StarRating';

const Profile: React.FC = () => {
  const { authUser } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!authUser.token || authUser.role !== 'user') return;
      
      setLoading(true);
      try {
        const response = await reviewApi.getUserReviews();
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [authUser.token, authUser.role]);

  if (!authUser.user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
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
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-sellera-purple flex items-center justify-center text-white text-2xl font-semibold mb-4">
                  {authUser.user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold">{authUser.user.name}</h2>
                <p className="text-gray-600">{authUser.user.email}</p>
                
                <div className="mt-6 w-full">
                  <div className="border-t pt-4">
                    <Link to="/orders" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                      <Package className="mr-3 h-5 w-5 text-sellera-purple" />
                      <span>My Orders</span>
                    </Link>
                    <Link to="/cart" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                      <Star className="mr-3 h-5 w-5 text-sellera-purple" />
                      <span>My Reviews</span>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="mb-6">
                <TabsTrigger value="info">
                  <User className="mr-2 h-4 w-4" />
                  Account Info
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="mr-2 h-4 w-4" />
                  My Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p>{authUser.user.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p>{authUser.user.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                        <p className="capitalize">{authUser.role}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                        <p>
                          {/* If we had account creation date, we'd format it here */}
                          May 2023
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>My Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="py-4 border-b">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-1/4 mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                          </div>
                        ))}
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review._id} className="py-4 border-b last:border-b-0">
                            <div className="flex items-center mb-2">
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                                <img 
                                  src={review.product.image?.url || '/placeholder.svg'} 
                                  alt={review.product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <Link 
                                  to={`/products/${review.product._id}`}
                                  className="font-medium hover:text-sellera-purple"
                                >
                                  {review.product.name}
                                </Link>
                                <StarRating rating={review.star} size={16} />
                              </div>
                            </div>
                            <p className="text-gray-700">{review.review}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">You haven't written any reviews yet.</p>
                        <Link to="/products">
                          <Button className="mt-4 bg-sellera-purple hover:bg-sellera-purple-dark">
                            Browse Products
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
