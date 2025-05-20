import React from 'react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  setRating, 
  size = 'md',
  disabled = false
}) => {
  const sizeClass = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          whileHover={!disabled ? { scale: 1.2 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          className={`${sizeClass[size]} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${
            rating >= star ? 'text-yellow-500' : 'text-gray-400'
          }`}
          onClick={() => !disabled && setRating(star)}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
};

export default StarRating;