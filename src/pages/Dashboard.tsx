import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import Cart from '../components/Cart';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { MealBox } from '../types';
import { WifiOff, Search, ShoppingBag } from 'lucide-react';

const mealBoxes: MealBox[] = [
  // Biryani Section
  {
    title: "Chicken Biryani",
    description: "Classic Hyderabadi style biryani",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 10,
    category: "biryani",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Extra portion of meat! Must pre-order",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 12,
    category: "biryani",
    tags: ["Pre-Order Required"],
    image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg"
  },
  // Veg Meal Box Section
  {
    title: "Kadai Paneer",
    description: "Cottage cheese in rich gravy served with Pulav, Channa Masala, and Chapati",
    emoji: "🧀",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 12,
    category: "veg",
    image: "https://images.food52.com/zirBKZRt4KJi1v8xTDbtvY2J82Y=/1200x900/a46010f2-9c79-48a8-8705-faa2ca19185b--2023-1109_sponsored_milkpep_recipe-final_kadai-paneer_unbranded_3x2_julia-gartland_156.jpg"
  },
  {
    title: "Okra Masala",
    description: "Fresh okra in aromatic spices served with Pulav, Channa Masala, and Chapati",
    emoji: "🥬",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 12,
    category: "veg",
    isNew: true,
    image: "https://aromaticessence.co/wp-content/uploads/2022/06/punjabi_bhindi_masala_gravy_1.jpg"
  },
  // Others Section
  {
    title: "Bisi Bele Bath",
    description: "Traditional Karnataka style rice dish",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    price: 12,
    category: "others",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/bisi-bele-bath.jpg"
  },
  // Non-Veg Meal Box Section
  {
    title: "Andhra Chicken",
    description: "Spicy Andhra style chicken served with Pulav, Channa Masala, and Chapati",
    emoji: "🌶️",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    price: 12,
    category: "non-veg",
    image: "https://www.whiskaffair.com/wp-content/uploads/2021/10/Andhra-Chicken-Curry-2-3.jpg"
  },
  {
    title: "Kadai Chicken",
    description: "Chicken in aromatic kadai gravy served with Pulav, Channa Masala, and Chapati",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    price: 12,
    category: "non-veg",
    image: "https://myfoodstory.com/wp-content/uploads/2021/09/kadai-chicken-1.jpg"
  }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
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

      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <CartProvider>
      <Layout>
        <div className="py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Welcome to <span className="text-amber-600 dark:text-amber-500">Biryani Boyz</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the authentic flavors of India with our carefully curated menu.
            </p>
            
            {offline && (
              <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-500">
                <WifiOff size={16} />
                <span className="text-sm font-medium">
                  You're offline. Changes will sync when you're back online.
                </span>
              </div>
            )}

            {/* Search */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredMealBoxes.map((meal) => (
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
              ))}
            </motion.div>
          )}

          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </Layout>
    </CartProvider>
  );
};

export default Dashboard;