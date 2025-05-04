
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { productApi } from '@/services/api';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAllProducts();
        
        // For demo purposes, just show first 8 products as featured
        setFeaturedProducts(response.data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', image: '/placeholder.svg', color: 'bg-sellera-blue' },
    { name: 'Clothing', image: '/placeholder.svg', color: 'bg-sellera-green' },
    { name: 'Accessories', image: '/placeholder.svg', color: 'bg-sellera-yellow' }
  ];

  return (
    <Layout>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-sellera-purple to-sellera-purple-dark text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Discover Amazing Products from Verified Vendors
              </h1>
              <p className="text-xl mb-6 opacity-90 animate-fade-in" style={{animationDelay: '0.1s'}}>
                SellEra brings you the best products from trusted sellers all in one place.
              </p>
              <div className="flex space-x-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <Link to="/products">
                  <Button className="bg-white text-sellera-purple hover:bg-opacity-90">
                    Browse Products
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-sellera-purple">
                    Become a Vendor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in" style={{animationDelay: '0.3s'}}>
              <img 
                src="/placeholder.svg" 
                alt="Shopping illustration" 
                className="max-w-full rounded-lg shadow-xl"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find what you need in our curated collections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={category.name} 
                to={`/products/category/${category.name}`}
                className="block group"
              >
                <div className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg ${category.color} bg-opacity-20 hover:bg-opacity-30`}>
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-gray-600">Explore our most popular items</p>
          </div>
          
          {error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-sellera-purple hover:bg-sellera-purple-dark"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} loading={loading} />
          )}
          
          <div className="text-center mt-10">
            <Link to="/products">
              <Button className="bg-sellera-purple hover:bg-sellera-purple-dark">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial section */}
      <section className="py-16 bg-sellera-purple-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">Read testimonials from satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Customer {i}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  "SellEra provides an amazing shopping experience! The products are high-quality and the service is excellent."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-sellera-charcoal text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start selling on SellEra?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of vendors who are growing their business with us.
          </p>
          <Link to="/register">
            <Button className="bg-white text-sellera-charcoal hover:bg-gray-100">
              Become a Vendor Today
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
