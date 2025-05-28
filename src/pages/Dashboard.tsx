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
    description: "Comes with Pulav, Channa Masala, Chapati, selected curry of your choice",
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
    description: "Comes with Pulav, Channa Masala, Chapati, selected curry of your choice",
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
      <div className="py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Welcome to <span className="text-amber-600 dark:text-amber-500">Biryani Boyz</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
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
            className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6"
          >
            {mealBoxes.map((mealBox) => (
              <div key={mealBox.title} className="space-y-8">
                {/* Category Header */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 dark:from-amber-500/20 dark:via-amber-500/30 dark:to-amber-500/20 px-4 sm:px-8 py-4 rounded-2xl shadow-lg backdrop-blur-sm w-full sm:w-auto"
                  >
                    <h2 className="flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold">
                      <span className="text-3xl sm:text-4xl md:text-5xl">{mealBox.emoji}</span>
                      <span>{mealBox.title}</span>
                      {mealBox.isNew && (
                        <span className="bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-medium animate-pulse">
                          NEW
                        </span>
                      )}
                    </h2>
                  </motion.div>
                  
                  {mealBox.description && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 text-sm sm:text-base text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full shadow-inner max-w-full sm:max-w-[80%] break-words"
                    >
                      {mealBox.description}
                    </motion.p>
                  )}
                </motion.div>

                {/* Dishes Grid */}
                <div className={`${mealBox.dishes ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8' : 'max-w-2xl mx-auto'}`}>
                  {mealBox.dishes ? (
                    mealBox.dishes.map((dish) => (
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
                    ))
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
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;