// Dashboard.tsx (final with updated countdown and date next to day)

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import Cart from '../components/Cart';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { MealBox } from '../types';
import { WifiOff, Search } from 'lucide-react';
//import { useSidebar } from '../components/SidebarContext';

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

const getOrderStatus = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const cutoffPassed = hour > 9 || (hour === 9 && minute >= 30);

  const availableDays: string[] = [];

  if (day === 5) {
    if (!cutoffPassed) availableDays.push('Friday');
    availableDays.push('Saturday');
  } else if (day === 6) {
    if (!cutoffPassed) availableDays.push('Saturday');
    else availableDays.push('Next Friday', 'Next Saturday');
  } else if (day === 0) {
    availableDays.push('Next Friday', 'Next Saturday');
  } else {
    availableDays.push('Friday', 'Saturday');
  }

  return availableDays;
};

const getCutoffDate = (targetDay: number) => {
  const now = new Date();
  const result = new Date(now);
  const currentDay = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const cutoffPassed = hour > 9 || (hour === 9 && minute >= 30);

  let daysUntil = (targetDay - currentDay + 7) % 7;
  if (daysUntil === 0 && cutoffPassed) daysUntil = 7;

  result.setDate(now.getDate() + daysUntil);
  result.setHours(9, 30, 0, 0);
  return result;
};

const formatDate = (targetTime: Date): string => {
  return targetTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

const CountdownTimer = ({ targetTime }: { targetTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Cutoff reached');
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const formatted = `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
      setTimeLeft(formatted);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return <p className="font-mono text-sm text-red-600">⏰ {timeLeft}</p>;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  //const { isSidebarOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const {
    reviews,
    loading,
    submitReview,
    updateReview,
    deleteReview,
    getAverageRating,
    offline
  } = useReviews(mealBoxes);

  const availableDays = getOrderStatus();

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
        <div className="py-6 pb-24">
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

            <div className="mt-10 text-center">
              <h2 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-2">Now Accepting Orders For:</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {availableDays.map((day) => {
                  const baseDay = day.includes('Friday') ? 5 : 6;
                  const targetTime = getCutoffDate(baseDay);
                  
                  return (
                    <div key={day} className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {formatDate(targetTime)}
                      </p>
                      <CountdownTimer targetTime={targetTime} />
                    </div>
                  );
                })}
              </div>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
                  transition={{
                    opacity: { duration: 0.6 },
                    y: { duration: 0.6 },
                    scale: {
                      delay: 0.8,
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                  className="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-4"
                >
                  ⏳ Orders close automatically when the countdown ends. Don’t miss out!
              </motion.p>
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
{isDashboard && availableDays.length > 0 && (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
    className="fixed bottom-0 left-0 right-0 w-full z-50 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-sm text-center py-2 shadow-md shadow-amber-300 dark:shadow-amber-800"
  >
    <div className="flex justify-center items-center gap-2 flex-wrap px-4">
      🛍️ Orders open for
      {availableDays.map((day, i) => {
        const baseDay = day.includes('Friday') ? 5 : 6;
        const targetTime = getCutoffDate(baseDay);
        return (
          <span key={i} className="font-semibold">
            {i > 0 ? ' and ' : ' '}{formatDate(targetTime)}
          </span>
        );
      })}
    </div>
  </motion.div>

)}
</Layout>
    </CartProvider>
  );
};

export default Dashboard;
