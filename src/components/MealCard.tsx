import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ShoppingBag } from 'lucide-react';
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
  const hasUserReviewed = user && reviews.some(r => r.user.uid === user.uid);

  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi Biryani Boyz! 🌟\n\n*I would like to order:*\n${meal.title} ($${meal.price})\n\n${meal.tags?.includes("Pre-Order Required") ? "*Note: This item requires pre-ordering*\n\n" : ""}Please reply with:\n1️⃣ Preferred delivery/pickup time\n2️⃣ Delivery address\n3️⃣ Any special instructions\n\nThank you! 😊`;
    window.location.replace(`https://wa.me/15185287832?text=${encodeURIComponent(message)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl overflow-hidden shadow-lg ${meal.bg} relative group`}
      layout
    >
      {/* Header Section */}
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2">
            <span className="text-amber-600 dark:text-amber-500 font-bold">$ {meal.price}</span>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-bold">{averageRating}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">5</span>
          </div>
        </div>

        {/* Title and Tags */}
        <div className="text-center space-y-4">
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
          
          {/* Description */}
          {meal.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {meal.description}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden bg-white/50 dark:bg-gray-800/50 p-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === 'details'
                ? 'bg-amber-600 text-white'
                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <ShoppingBag size={16} />
            <span className="font-medium">Order</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all ${
              activeTab === 'reviews'
                ? 'bg-amber-600 text-white'
                : 'hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <MessageSquare size={16} />
            <span className="font-medium">Reviews ({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 pt-0"
          >
            <motion.button
              onClick={handleOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white rounded-full py-2.5 px-4 flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png"
                alt="WhatsApp"
                className="w-5 h-5"
              />
              <span className="font-medium">Order on WhatsApp</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 pt-0 space-y-6"
          >
            {/* Review Form */}
            {user && !hasUserReviewed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg"
              >
                <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
                <ReviewForm onSubmit={onSubmitReview} />
              </motion.div>
            )}

            {/* Reviews List */}
            <motion.div className="space-y-4">
              <h3 className="font-semibold text-xl">
                {reviews.length > 0 ? 'Recent Reviews' : 'No reviews yet'}
              </h3>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 max-h-[28rem] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200 dark:scrollbar-thumb-amber-800 scrollbar-track-transparent"
              >
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <motion.div 
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-md transition-transform hover:scale-[1.02]"
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
                  >
                    <p className="text-gray-500 dark:text-gray-400">
                      Be the first to share your thoughts!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealCard;