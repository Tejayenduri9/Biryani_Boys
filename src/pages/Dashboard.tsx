import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MealBox } from '../types';
import { WifiOff, Search, ChevronRight, Plus, Minus, Check } from 'lucide-react';
import { getOrderStatus } from '../utils/getAvailableDays';

const mealBoxes: MealBox[] = [
  {
    title: "Chicken Biryani",
    description: "Classic Hyderabadi style biryani with aromatic basmati rice",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 10,
    category: "biryani",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Double the protein! Must pre-order for extra portions",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 12,
    category: "biryani",
    tags: ["Pre-Order Required"],
    image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg"
  },
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
  {
    title: "Bisi Bele Bath",
    description: "Traditional Karnataka style rice dish with lentils and vegetables",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    price: 12,
    category: "others",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/bisi-bele-bath.jpg"
  },
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

const categories = [
  { id: 'biryani', name: 'Biryani Special', icon: '🍗' },
  { id: 'veg', name: 'Vegetarian', icon: '🥬' },
  { id: 'non-veg', name: 'Non-Vegetarian', icon: '🌶️' },
  { id: 'others', name: 'Traditional', icon: '🍚' }
];

const OrderSteps = () => {
  const steps = ['Choose Category', 'Select Meal', 'Review Order'];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            index <= currentStep 
              ? 'bg-amber-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}>
            {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-2 ${
              index < currentStep ? 'bg-amber-600' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

const CategoryCard = ({ category, isSelected, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'ring-4 ring-amber-500 shadow-xl' 
        : 'hover:shadow-lg'
    }`}
  >
    <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 p-8 flex flex-col items-center justify-center text-center">
      <div className="text-4xl mb-4">{category.icon}</div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {category.name}
      </h3>
      <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
        isSelected ? 'bg-amber-600' : 'bg-gray-300'
      }`} />
    </div>
  </motion.div>
);

const MealCard = ({ meal, onAddToCart }: any) => {
  const [quantity, setQuantity] = useState(0);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        addItem(meal.title, meal.price);
      }
      setQuantity(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg">
          <span className="text-amber-600 dark:text-amber-500 font-bold">
            ${meal.price}
          </span>
        </div>
        {meal.isNew && (
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              NEW
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{meal.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {meal.description}
        </p>

        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {meal.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              quantity > 0
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Order
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const StickyCartSummary = () => {
  const { items, total } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40"
    >
      <div className="p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div>
            <h3 className="font-bold text-lg">Your Order</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-xl text-amber-600">${total.toFixed(2)}</p>
            <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 space-y-3 max-h-60 overflow-y-auto"
            >
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 bg-amber-600 text-white py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors"
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  const {
    reviews,
    loading,
    offline
  } = useReviews(mealBoxes);

  const availableDays = getOrderStatus();

  const filteredMealBoxes = useMemo(() => {
    let filtered = mealBoxes;
    
    if (selectedCategory) {
      filtered = filtered.filter(meal => meal.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(meal =>
        meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header Section */}
        <div className="pt-8 pb-6 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Build Your <span className="text-amber-600 dark:text-amber-500">Perfect Meal</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Choose from our authentic Indian dishes, crafted with traditional recipes and fresh ingredients
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

          {/* Order Steps */}
          <div className="mt-8">
            <OrderSteps />
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for your favorite dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Category Selection */}
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-12"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Choose Your Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    isSelected={false}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Meal Selection */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-24"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">
                  {categories.find(c => c.id === selectedCategory)?.name} Menu
                </h2>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  ← Back to Categories
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredMealBoxes.map((meal) => (
                    <MealCard
                      key={meal.title}
                      meal={meal}
                      onAddToCart={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Sticky Cart Summary */}
        <StickyCartSummary />

        {/* Order Status Banner */}
        {isDashboard && availableDays.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="fixed bottom-0 left-0 right-0 w-full z-30 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 text-sm text-center py-3 shadow-lg"
          >
            <div className="flex justify-center items-center gap-2 flex-wrap px-4">
              🛍️ Orders open for {availableDays.map((day, i) => (
                <span key={i} className="font-semibold">
                  {i > 0 ? ' and ' : ' '}{day.label} ({day.date})
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;