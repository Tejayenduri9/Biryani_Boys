import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';
import { MealBox, Review } from '../types';
import { User } from '../types';

interface MealCardProps {
  meal: MealBox;
  reviews: Review[];
  averageRating: string;
  user: User | null;
  onSubmitReview: (comment: string, rating: number) => Promise<boolean | undefined>;
  onUpdateReview: (reviewId: string, comment: string, rating: number) => Promise<boolean | undefined>;
  onDeleteReview: (reviewId: string) => Promise<boolean | undefined>;
}

const MealCard: React.FC<MealCardProps> = ({
  meal,
  averageRating
}) => {
  const handleOrder = () => {
    const message = `Hi! I would like to order ${meal.title} (${meal.price}$)`;
    const whatsappUrl = `https://wa.me/15185287832?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl overflow-hidden shadow-lg ${meal.bg} relative p-6`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        {/* Price Tag */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2">
          <span className="text-amber-600 dark:text-amber-500 font-bold">$ {meal.price}</span>
        </div>

        {/* Rating */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold">{averageRating}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">5</span>
        </div>
      </div>

      {/* Title and Description */}
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-2xl font-bold">
          {meal.title}
        </h2>
        {meal.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {meal.description}
          </p>
        )}
      </div>

      {/* WhatsApp Order Button */}
      <motion.button
        onClick={handleOrder}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">Order on WhatsApp</span>
      </motion.button>
    </motion.div>
  );
};

export default MealCard;