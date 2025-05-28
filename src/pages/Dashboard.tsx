import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { MealBox } from '../types';
import { WifiOff, Search } from 'lucide-react';

// Categories
const CATEGORIES = {
  ALL: 'All',
  BIRYANI: 'Biryani',
  NON_VEG: 'Non-Veg',
  VEG: 'Veg',
  OTHERS: 'Others'
} as const;

type Category = typeof CATEGORIES[keyof typeof CATEGORIES];

const mealBoxes: MealBox[] = [
  {
    title: "Andhra Chicken",
    description: "Spicy Andhra style chicken curry with authentic spices and herbs. Comes with Pulav, Channa Masala, Chapati.",
    emoji: "🌶️",
    bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    price: 12,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.NON_VEG
  },
  {
    title: "Kadai Chicken",
    description: "Tender chicken cooked with bell peppers in a rich tomato gravy. Comes with Pulav, Channa Masala, Chapati.",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    price: 12,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.NON_VEG
  },
  {
    title: "Kadai Paneer",
    description: "Fresh cottage cheese with bell peppers in aromatic spices. Comes with Pulav, Channa Masala, Chapati.",
    emoji: "🧀",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
    price: 12,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.VEG
  },
  {
    title: "Okra Masala",
    description: "Crispy okra tossed with onions and Indian spices. Comes with Pulav, Channa Masala, Chapati.",
    emoji: "🥬",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 12,
    isNew: true,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.VEG
  },
  {
    title: "Regular Chicken Biryani",
    description: "Classic Hyderabadi biryani with tender chicken pieces",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 10,
    category: CATEGORIES.BIRYANI
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Our signature biryani loaded with extra chicken pieces",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 12,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.BIRYANI
  },
  {
    title: "Bisi Bele Bath",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
    price: 12,
    description: "Traditional Karnataka style spicy rice with lentils and vegetables. Comes with Pulav, Channa Masala, Chapati.",
    isNew: true,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.OTHERS
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES.ALL);
  
  const { 
    reviews, 
    loading, 
    submitReview, 
    updateReview, 
    deleteReview, 
    getAverageRating,
    offline 
  } = useReviews(mealBoxes);

  const filteredMealBoxes = useMemo(() => {
    return mealBoxes.filter(mealBox => {
      const matchesSearch = searchQuery === '' || 
        mealBox.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mealBox.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === CATEGORIES.ALL || 
        mealBox.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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

          {/* Search and Categories */}
          <div className="mt-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search meals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {Object.values(CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6"
          >
            {filteredMealBoxes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  No meals found matching your search criteria.
                </p>
              </motion.div>
            ) : (
              filteredMealBoxes.map((meal) => (
                <MealCard
                  key={meal.title}
                  meal={meal}
                  reviews={reviews[meal.title] || []}
                  averageRating={getAverageRating(meal.title)}
                  user={user}
                  onSubmitReview={(comment, rating) => submitReview(meal.title, comment, rating)}
                  onUpdateReview={(reviewId, comment, rating) => 
                    updateReview(meal.title, reviewId, comment, rating)
                  }
                  onDeleteReview={(reviewId) => deleteReview(meal.title, reviewId)}
                />
              ))
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;