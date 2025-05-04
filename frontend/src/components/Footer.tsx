
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-sellera-charcoal text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold">SellEra</Link>
            <p className="mt-4 text-gray-300">Your premier marketplace for quality products from trusted vendors.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/category/Electronics" className="text-gray-300 hover:text-white transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products/category/Clothing" className="text-gray-300 hover:text-white transition-colors">Clothing</Link>
              </li>
              <li>
                <Link to="/products/category/Accessories" className="text-gray-300 hover:text-white transition-colors">Accessories</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">
                Email: info@sellera.com
              </li>
              <li className="text-gray-300">
                Phone: (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SellEra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
