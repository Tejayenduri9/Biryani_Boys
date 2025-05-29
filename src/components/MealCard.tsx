import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ShoppingBag } from 'lucide-react';
import { MealBox, Review } from '../types';
import { User } from '../types';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';

interface MealCardProps {
  meal: MealBox;
  reviews: Review[];
  averageRating: string;
  user: User | null;
  onSubmitReview: (comment: string, rating: number) => Promise<boolean | undefined>;
  onUpdateReview: (reviewId: string, comment: string, rating: number) => Promise<boolean | undefined>;
  onDeleteReview: (reviewId: string) => Promise<boolean | undefined>;
}

type Tab = 'details' | 'reviews';

const MealCard: React.FC<MealCardProps> = ({
  meal,
  reviews,
  averageRating,
  user,
  onSubmitReview,
  onUpdateReview,
  onDeleteReview
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const hasUserReviewed = user && reviews.some(r => r.user.uid === user.uid);
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl overflow-hidden shadow-lg ${meal.bg} relative group`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={meal.image}
          alt={meal.title}
          onLoad={() => setIsImageLoaded(true)}
          animate={{ opacity: isImageLoaded ? 1 : 0 }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Price Tag */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2">
          <span className="text-amber-600 dark:text-amber-500 font-bold">$ {meal.price}</span>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold">{averageRating}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">5</span>
        </div>

        {/* New Tag */}
        {meal.isNew && (
          <div className="absolute bottom-4 right-4">
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              NEW
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title and Description */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">
            {meal.title}
          </h2>
          {meal.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {meal.description}
            </p>
          )}
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {meal.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => addItem(meal.title, meal.price)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-amber-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
          </motion.button>
          
          <motion.button
            onClick={() => setActiveTab(activeTab === 'reviews' ? 'details' : 'reviews')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Reviews Section */}
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Review Form */}
              {user && !hasUserReviewed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg"
                >
                  <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
                  <ReviewForm onSubmit={onSubmitReview} />
                </motion.div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xl">
                  {reviews.length > 0 ? 'Recent Reviews' : 'No reviews yet'}
                </h3>

                <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800 scrollbar-track-transparent">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md"
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-amber-200 dark:border-amber-800"
                    >
                      <p className="text-gray-500 dark:text-gray-400">
                        Be the first to share your thoughts!
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MealCard;