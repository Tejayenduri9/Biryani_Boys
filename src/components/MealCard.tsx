import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';
import { MealBox, Review } from '../types';
import { User } from '../types';
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

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi Biryani Boyz! 🌟\n\n*I would like to order:*\n${meal.title} ($${meal.price})\n\n${meal.tags?.includes("Pre-Order Required") ? "*Note: This item requires pre-ordering*\n\n" : ""}Please reply with:\n1️⃣ Preferred delivery/pickup time\n2️⃣ Delivery address\n3️⃣ Any special instructions\n\nThank you! 😊`;
    window.location.href = `https://wa.me/15185287832?text=${encodeURIComponent(message)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl overflow-hidden shadow-lg ${meal.bg} relative group`}
      layout
    >
      {/* Main Content */}
      <motion.div className="p-6" layout>
        {/* Header Section */}
        <motion.div className="flex justify-between items-start mb-6" layout>
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
        </motion.div>

        {/* Title and Description */}
        <motion.div className="text-center space-y-4 mb-6" layout>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {meal.title}
            </h2>
            {meal.isNew && (
              <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                NEW
              </span>
            )}
            {meal.tags && meal.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {meal.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-white/70 dark:bg-gray-800/70 text-xs px-2 py-1 rounded-full font-medium text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {meal.description && (
            <p className="text-gray-600 dark:text-gray-400">
              {meal.description}
            </p>
          )}
        </motion.div>

        {/* WhatsApp Order Button */}
        <motion.a
          href={`https://wa.me/15185287832?text=${encodeURIComponent(`Hi Biryani Boyz! 🌟\n\n*I would like to order:*\n${meal.title} ($${meal.price})\n\n${meal.tags?.includes("Pre-Order Required") ? "*Note: This item requires pre-ordering*\n\n" : ""}Please reply with:\n1️⃣ Preferred delivery/pickup time\n2️⃣ Delivery address\n3️⃣ Any special instructions\n\nThank you! 😊`)}`}
          onClick={handleOrder}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg transition-colors mb-4 cursor-pointer"
          layout
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png"
            alt="WhatsApp"
            className="w-5 h-5"
          />
          <span className="font-medium">Order on WhatsApp</span>
        </motion.a>

        {/* Expand/Collapse Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          layout
        >
          <span className="font-medium">
            {isExpanded ? 'Hide Reviews' : `Show Reviews (${reviews.length})`}
          </span>
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Reviews Section */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key={`reviews-${meal.title}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.2 },
                opacity: { duration: 0.1 }
              }
            }}
            className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            layout
          >
            <motion.div 
              className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm space-y-6"
              layout
            >
              {/* Review Form */}
              {user && !hasUserReviewed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg"
                  layout
                >
                  <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
                  <ReviewForm onSubmit={onSubmitReview} />
                </motion.div>
              )}

              {/* Reviews List */}
              <motion.div className="space-y-4" layout>
                <h3 className="font-semibold text-xl">
                  {reviews.length > 0 ? 'Recent Reviews' : 'No reviews yet'}
                </h3>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800 scrollbar-track-transparent"
                  layout
                >
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <motion.div 
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md transition-transform hover:scale-[1.02]"
                        layout
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
                      transition={{ delay: 0.2 }}
                      className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-amber-200 dark:border-amber-800"
                      layout
                    >
                      <p className="text-gray-500 dark:text-gray-400">
                        Be the first to share your thoughts!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealCard;