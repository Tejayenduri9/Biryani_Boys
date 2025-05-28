import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, DollarSign } from 'lucide-react';
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="p-[2px] rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500">
        <motion.div
          whileHover={cardVariants.hover}
          whileTap={cardVariants.tap}
          className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${meal.bg} relative`}
        >
          {/* Card Header */}
          <motion.div 
            className="p-6 cursor-pointer relative"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 dark:to-gray-900/80 z-10"></div>
              <img
                src="https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Biryani Background"
                className="w-full h-full object-cover opacity-20"
              />
            </div>

            {/* Content */}
            <div className="relative z-20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{meal.price}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{averageRating}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-400">5</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-3">
                {meal.title}
                {meal.isNew && (
                  <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold bg-yellow-400 text-black rounded-full">
                    NEW
                  </span>
                )}
              </h2>

              {meal.description && (
                <p className="text-center text-gray-600 dark:text-gray-400 mb-3">
                  {meal.description}
                </p>
              )}

              {meal.dishes && meal.dishes.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {meal.dishes.map((dish, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-sm font-medium"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/80 dark:bg-gray-800/80 rounded-full p-1"
                >
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-amber-200 dark:border-amber-800 overflow-hidden"
              >
                <div className="p-6 space-y-6 bg-gradient-to-b from-white/80 to-white/95 dark:from-gray-800/80 dark:to-gray-800/95 backdrop-blur-sm">
                  {/* Form for adding a review */}
                  {user && !hasUserReviewed && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-amber-100 dark:border-amber-900">
                      <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
                      <ReviewForm onSubmit={onSubmitReview} />
                    </div>
                  )}
                  
                  {/* List of reviews */}
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
                          <div 
                            key={review.id} 
                            className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md border border-amber-100 dark:border-amber-900 transition-transform hover:scale-[1.02]"
                          >
                            <ReviewItem
                              review={review}
                              isOwner={user?.uid === review.user.uid}
                              onUpdate={onUpdateReview}
                              onDelete={onDeleteReview}
                            />
                          </div>
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
      </div>
    </motion.div>
  );
};

export default MealCard;