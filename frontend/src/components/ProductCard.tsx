
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  // Function to handle adding product to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Placeholder image URL if no image is available
  const imageUrl = product.image?.url || '/placeholder.svg';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
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
            <span className="font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
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
    </div>
  );
};

export default ProductCard;
