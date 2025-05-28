import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { MealBox } from '../types';
import { WifiOff } from 'lucide-react';

const mealBoxes: MealBox[] = [
  {
    title: "Non-Veg Meal Box",
    emoji: "🍖",
    bg: "bg-red-100 dark:bg-red-900/30",
    price: 12,
    description: "Comes with Pulav, Channa Masala, Chapati",
    dishes: [
      {
        title: "Andhra Chicken",
        description: "Spicy Andhra style chicken curry",
        emoji: "🌶️",
        bg: "bg-orange-100 dark:bg-orange-900/30",
        price: 12
      },
      {
        title: "Kadai Chicken",
        description: "Flavorful chicken cooked with bell peppers",
        emoji: "🍗",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        price: 12
      }
    ]
  },
  {
    title: "Veg Meal Box",
    emoji: "🥬",
    bg: "bg-green-100 dark:bg-green-900/30",
    price: 12,
    description: "Comes with Pulav, Channa Masala, Chapati",
    dishes: [
      {
        title: "Kadai Paneer",
        description: "Cottage cheese with bell peppers",
        emoji: "🧀",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        price: 12
      },
      {
        title: "Okra Masala",
        description: "Fresh okra cooked with Indian spices",
        emoji: "🥬",
        bg: "bg-green-100 dark:bg-green-900/30",
        price: 12,
        isNew: true
      },
      {
        title: "Bisi Bele Bath",
        description: "Traditional Karnataka style rice dish",
        emoji: "🍚",
        bg: "bg-amber-100 dark:bg-amber-900/30",
        price: 12
      }
    ]
  },
  {
    title: "Chicken Biryani",
    emoji: "🍗",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    price: 10,
    description: "Authentic Hyderabadi style biryani"
  }
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
            Rate Your <span className="text-amber-600 dark:text-amber-500">Biryani Boyz</span> Experience
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
            className="space-y-12 max-w-7xl mx-auto px-4"
          >
            {mealBoxes.map((mealBox) => (
              <div key={mealBox.title} className="space-y-6">
                {/* Category Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold flex items-center justify-center gap-3">
                    <span>{mealBox.emoji}</span>
                    <span>{mealBox.title}</span>
                    <span className="text-lg font-normal text-gray-500">
                      (${mealBox.price})
                    </span>
                  </h2>
                  {mealBox.description && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {mealBox.description}
                    </p>
                  )}
                </motion.div>

                {/* Dishes Grid */}
                {mealBox.dishes ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mealBox.dishes.map((dish) => (
                      <MealCard
                        key={dish.title}
                        meal={dish}
                        reviews={reviews[dish.title] || []}
                        averageRating={getAverageRating(dish.title)}
                        user={user}
                        onSubmitReview={(comment, rating) => submitReview(dish.title, comment, rating)}
                        onUpdateReview={(reviewId, comment, rating) => 
                          updateReview(dish.title, reviewId, comment, rating)
                        }
                        onDeleteReview={(reviewId) => deleteReview(dish.title, reviewId)}
                      />
                    ))}
                  </div>
                ) : (
                  <MealCard
                    meal={mealBox}
                    reviews={reviews[mealBox.title] || []}
                    averageRating={getAverageRating(mealBox.title)}
                    user={user}
                    onSubmitReview={(comment, rating) => submitReview(mealBox.title, comment, rating)}
                    onUpdateReview={(reviewId, comment, rating) => 
                      updateReview(mealBox.title, reviewId, comment, rating)
                    }
                    onDeleteReview={(reviewId) => deleteReview(mealBox.title, reviewId)}
                  />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;