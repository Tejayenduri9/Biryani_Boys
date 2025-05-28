import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, MessageCircle } from 'lucide-react';
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
      className={`rounded-2xl overflow-hidden shadow-lg ${meal.bg} relative`}
    >
      <div className="p-6">
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
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            {meal.title}
            {meal.isNew && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-black rounded-full">
                NEW
              </span>
            )}
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
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg transition-colors mb-6"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Order on WhatsApp</span>
        </motion.button>

        {/* Expand/Collapse Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </motion.button>
        </div>
      </div>

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
            <div className="p-6 space-y-6 bg-white/90 dark:bg-gray-900/90">
              {/* Add Review Form */}
              {user && !hasUserReviewed && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-amber-100 dark:border-amber-900">
                  <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
                  <ReviewForm onSubmit={onSubmitReview} />
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xl">
                  {reviews.length > 0 ? 'Recent Reviews' : 'No reviews yet'}
                  {reviews.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
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
  );
};

export default MealCard;