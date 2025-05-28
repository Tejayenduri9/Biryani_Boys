import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { MealBox } from '../types';
import { WifiOff, ChevronDown, Search } from 'lucide-react';

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
    title: "Non-Veg Meal Box",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30",
    price: 12,
    description: "Comes with Pulav, Channa Masala, Chapati, selected curry of your choice",
    tags: ["Pre-Order Required"],
    category: CATEGORIES.NON_VEG,
    dishes: [
      {
        title: "Andhra Chicken",
        description: "Spicy Andhra style chicken curry with authentic spices and herbs",
        emoji: "🌶️",
        bg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
        price: 12,
        tags: ["Pre-Order Required"],
        category: CATEGORIES.NON_VEG
      },
      {
        title: "Kadai Chicken",
        description: "Tender chicken cooked with bell peppers in a rich tomato gravy",
        emoji: "🍗",
        bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
        price: 12,
        tags: ["Pre-Order Required"],
        category: CATEGORIES.NON_VEG
      }
    ]
  },
  {
    title: "Veg Meal Box",
    emoji: "🥬",
    bg: "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30",
    price: 12,
    description: "Comes with Pulav, Channa Masala, Chapati, selected curry of your choice",
    tags: ["Pre-Order Required"],
    category: CATEGORIES.VEG,
    dishes: [
      {
        title: "Kadai Paneer",
        description: "Fresh cottage cheese with bell peppers in aromatic spices",
        emoji: "🧀",
        bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
        price: 12,
        tags: ["Pre-Order Required"],
        category: CATEGORIES.VEG
      },
      {
        title: "Okra Masala",
        description: "Crispy okra tossed with onions and Indian spices",
        emoji: "🥬",
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        price: 12,
        isNew: true,
        tags: ["Pre-Order Required"],
        category: CATEGORIES.VEG
      }
    ]
  },
  {
    title: "Bisi Bele Bath",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
    price: 12,
    description: "Traditional Karnataka style spicy rice with lentils and vegetables",
    isNew: true,
    tags: ["Pre-Order Required"],
    category: CATEGORIES.OTHERS
  },
  {
    title: "Chicken Biryani",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30",
    price: 10,
    description: "Authentic Hyderabadi style biryani",
    category: CATEGORIES.BIRYANI,
    dishes: [
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
      }
    ]
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
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
        mealBox.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mealBox.dishes?.some(dish => 
          dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

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

  const handleMealClick = (mealTitle: string) => {
    setExpandedMeal(expandedMeal === mealTitle ? null : mealTitle);
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
            className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6"
          >
            {filteredMealBoxes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-600 dark:text-gray-400">
                  No meals found matching your search criteria.
                </p>
              </motion.div>
            ) : (
              filteredMealBoxes.map((mealBox) => (
                <div key={mealBox.title} className="space-y-8">
                  {/* Category Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex flex-col items-center text-center space-y-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => mealBox.dishes && handleMealClick(mealBox.title)}
                      className={`bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 dark:from-amber-500/20 dark:via-amber-500/30 dark:to-amber-500/20 px-4 sm:px-8 py-4 rounded-2xl shadow-lg backdrop-blur-sm w-full sm:w-auto ${mealBox.dishes ? 'cursor-pointer' : ''}`}
                    >
                      <h2 className="flex items-center justify-center gap-3 text-2xl sm:text-3xl md:text-4xl font-bold">
                        <span className="text-3xl sm:text-4xl md:text-5xl">{mealBox.emoji}</span>
                        <span>{mealBox.title}</span>
                        {mealBox.isNew && (
                          <span className="bg-green-500 text-white text-xs sm:text-sm px-2 py-1 rounded-full font-medium animate-pulse">
                            NEW
                          </span>
                        )}
                        {mealBox.dishes && (
                          <motion.div
                            animate={{ rotate: expandedMeal === mealBox.title ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-6 h-6" />
                          </motion.div>
                        )}
                      </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full shadow-inner"
                    >
                      {mealBox.description}
                    </motion.p>
                  </motion.div>

                  {/* Dishes Grid */}
                  <AnimatePresence mode="wait">
                    {(!mealBox.dishes || expandedMeal === mealBox.title) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${mealBox.dishes ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8' : 'max-w-2xl mx-auto'}`}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;