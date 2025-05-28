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
    bg: "bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30",
    price: 12,
    description: "Comes with Pulav, Channa Masala, Chapati",
    dishes: [
      {
        title: "Andhra Chicken",
        description: "Spicy Andhra style chicken curry with authentic spices and herbs",
        emoji: "🌶️",
        bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
        price: 12
      },
      {
        title: "Kadai Chicken",
        description: "Tender chicken cooked with bell peppers in a rich tomato gravy",
        emoji: "🍗",
        bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
        price: 12
      }
    ]
  },
  {
    title: "Veg Meal Box",
    emoji: "🥬",
    bg: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
    price: 12,
    description: "Comes with Pulav, Channa Masala, Chapati",
    dishes: [
      {
        title: "Kadai Paneer",
        description: "Fresh cottage cheese with bell peppers in aromatic spices",
        emoji: "🧀",
        bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
        price: 12
      },
      {
        title: "Okra Masala",
        description: "Crispy okra tossed with onions and Indian spices",
        emoji: "🥬",
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        price: 12,
        isNew: true
      }
    ]
  },
  {
    title: "Bisi Bele Bath",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
    price: 12,
    description: "Traditional Karnataka style spicy rice with lentils and vegetables",
    isNew: true
  },
  {
    title: "Chicken Biryani",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
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
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Welcome to <span className="text-amber-600 dark:text-amber-500">Biryani Boyz</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the authentic flavors of India with our carefully curated menu. Each dish is crafted with love, 
            using traditional recipes and the finest ingredients to bring you a taste of home.
          </p>
          
          {offline && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500">
              <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium">
                You're offline. Changes will sync when you're back online.
              </span>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 sm:space-y-12 lg:space-y-16 max-w-7xl mx-auto"
          >
            {mealBoxes.map((mealBox) => (
              <div key={mealBox.title} className="space-y-6 sm:space-y-8">
                {/* Category Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center relative px-4"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  
                  <h2 className="relative inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#fdf6e3] dark:bg-gray-900 px-3 sm:px-4 text-xl sm:text-2xl md:text-3xl font-bold">
                    <span className="text-2xl sm:text-3xl md:text-4xl">{mealBox.emoji}</span>
                    <span>{mealBox.title}</span>
                    {mealBox.isNew && (
                      <span className="bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                        NEW
                      </span>
                    )}
                    <span className="text-base sm:text-lg md:text-xl font-normal text-gray-500 dark:text-gray-400">
                      (${mealBox.price})
                    </span>
                  </h2>
                  
                  {mealBox.description && (
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4">
                      {mealBox.description}
                    </p>
                  )}
                </motion.div>

                {/* Dishes Grid */}
                {mealBox.dishes ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
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
                  <div className="max-w-2xl mx-auto px-4">
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
                  </div>
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