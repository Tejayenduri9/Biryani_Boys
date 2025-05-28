import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, DollarSign, MessageCircle } from 'lucide-react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
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
  reviews,
  averageRating,
  user,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasUserReviewed = user && reviews.some(r => r.user.uid === user.uid);
  
  const cardVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const handleOrder = () => {
    const message = `Hi! I would like to order ${meal.title} (${meal.price}$)`;
    const whatsappUrl = `https://wa.me/15185287832?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      {/* Glowing border effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <motion.div
        whileHover={cardVariants.hover}
        whileTap={cardVariants.tap}
        className={`relative rounded-2xl overflow-hidden shadow-lg ${meal.bg}`}
      >
        {/* Card Header */}
        <motion.div className="p-6">
          {/* Price, Rating, and Order Button */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <motion.div 
              className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-lg">{meal.price}</span>
            </motion.div>
            
            <motion.button
              onClick={handleOrder}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Order on WhatsApp</span>
            </motion.button>
            
            <motion.div 
              className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold">{averageRating}</span>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">5</span>
            </motion.div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-3 mb-6">
            <h2 className="text-2xl font-bold">
              {meal.title}
              {meal.isNew && (
                <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-black rounded-full animate-pulse">
                  NEW
                </span>
              )}
            </h2>
            
            {meal.description && (
              <p className="text-gray-600 dark:text-gray-300">
                {meal.description}
              </p>
            )}
          </div>

          {/* Dishes */}
          {meal.dishes && meal.dishes.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {meal.dishes.map((dish, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium shadow-md backdrop-blur-sm"
                >
                  {dish}
                </motion.span>
              ))}
            </div>
          )}
          
          {/* Expand/Collapse Button */}
          <div className="flex justify-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg backdrop-blur-sm cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </motion.div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-amber-200 dark:border-amber-800"
            >
              <div className="p-6 space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                {/* Add Review Form */}
                {user && !hasUserReviewed && (
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-amber-100 dark:border-amber-900">
                    <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
                    <ReviewForm onSubmit={onSubmitReview} />
                  </div>
                )}
                
                {/* Reviews List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-xl flex items-center gap-2">
                    <span>{reviews.length > 0 ? 'Recent Reviews' : 'No reviews yet'}</span>
                    {reviews.length > 0 && (
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        ({reviews.length})
                      </span>
                    )}
                  </h3>
                  
                  <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800 scrollbar-track-transparent">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <motion.div 
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md border border-amber-100 dark:border-amber-900 transition-transform hover:scale-[1.02]"
                        >
                          <ReviewItem
                            review={review}
                            isOwner={user?.uid === review.user.uid}
                            onUpdate={onUpdateReview}
                            onDelete={onDeleteReview}
                          />
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-amber-200 dark:border-amber-800">
                        <p className="text-gray-500 dark:text-gray-400">
                          Be the first to share your thoughts!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MealCard;