import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { MealBox } from '../types';
import { WifiOff } from 'lucide-react';

const mealBoxes: MealBox[] = [
  { title: "Chicken Biryani", emoji: "🍗", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    reviews, 
    loading, 
    submitReview, 
    updateReview, 
    deleteReview, 
    getAverageRating,
    offline 
  } = useReviews(mealBoxes);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Rate Your <span className="text-amber-600 dark:text-amber-500">Food</span> Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We value your feedback! Share your thoughts on our delicious meals to help us serve you better.
          </p>
          
          {offline && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500">
              <WifiOff size={16} />
              <span className="text-sm font-medium">
                You're offline. Changes will sync when you're back online.
              </span>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto"
          >
            <MealCard
              key={mealBoxes[0].title}
              meal={mealBoxes[0]}
              reviews={reviews[mealBoxes[0].title] || []}
              averageRating={getAverageRating(mealBoxes[0].title)}
              user={user}
              onSubmitReview={(comment, rating) => submitReview(mealBoxes[0].title, comment, rating)}
              onUpdateReview={(reviewId, comment, rating) => 
                updateReview(mealBoxes[0].title, reviewId, comment, rating)
              }
              onDeleteReview={(reviewId) => deleteReview(mealBoxes[0].title, reviewId)}
            />
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;