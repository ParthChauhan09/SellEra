
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  max = 5, 
  size = 20,
  onChange 
}) => {
  const isInteractive = !!onChange;
  
  // Generate an array of numbers from 1 to max
  const stars = Array.from({ length: max }, (_, index) => index + 1);
  
  return (
    <div className="flex">
      {stars.map(star => (
        <span 
          key={star}
          onClick={() => isInteractive && onChange(star)}
          className={`
            ${isInteractive ? 'cursor-pointer' : ''}
            ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}
            transition-colors
          `}
          onMouseEnter={() => {
            if (isInteractive) {
              const stars = document.querySelectorAll('.star');
              stars.forEach((el, index) => {
                if (index < star) {
                  el.classList.add('text-yellow-400');
                  el.classList.remove('text-gray-300');
                } else {
                  el.classList.add('text-gray-300');
                  el.classList.remove('text-yellow-400');
                }
              });
            }
          }}
        >
          <Star 
            className="star"
            size={size} 
            fill={star <= rating ? 'currentColor' : 'none'} 
          />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
