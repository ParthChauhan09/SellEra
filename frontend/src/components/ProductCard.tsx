
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle adding product to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // Function to handle wishlist
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to wishlist!`);
  };

  // Function to handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`Quick view for ${product.name}`);
  };

  // Placeholder image URL if no image is available
  const imageUrl = product.image?.url || '/placeholder.svg';

  return (
    <motion.div
      className="product-card relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-image"
          />

          {/* Category Badge */}
          {product.category && (
            <Badge className={`absolute top-2 left-2 category-badge ${product.category.toLowerCase()}`}>
              {product.category}
            </Badge>
          )}

          {/* Sale Badge */}
          {product.sale > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              {product.sale}% OFF
            </Badge>
          )}

          {/* Quick Action Buttons */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : '100%' }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white text-sellera-purple hover:bg-sellera-purple hover:text-white"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white text-sellera-purple hover:bg-sellera-purple hover:text-white"
              onClick={handleAddToWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white text-sellera-purple hover:bg-sellera-purple hover:text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
          <p className="text-sellera-gray text-sm mb-2 h-12 overflow-hidden">
            {product.description.length > 60 ?
              `${product.description.substring(0, 60)}...` :
              product.description
            }
          </p>

          <div className="flex justify-between items-center mt-2">
            <div>
              {product.sale > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-sellera-purple">
                    ${(product.price * (1 - product.sale / 100)).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-lg text-sellera-purple">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-sellera-purple hover:bg-sellera-purple-dark"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
