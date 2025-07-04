import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { MealBox } from '../types';
import { WifiOff, Search, ChevronRight, Plus, Minus, Check, Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { getOrderStatus } from '../utils/getAvailableDays';

const mealBoxes: MealBox[] = [
  {
    title: "Chicken Biryani",
    description: "Aromatic basmati rice layered with tender chicken, saffron, and traditional spices. Served with cooling raita and pickled onions.",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 10,
    category: "biryani",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Our signature biryani with double the protein! Generous portions of succulent chicken for the true meat lovers.",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 12,
    category: "biryani",
    tags: ["Pre-Order Required", "Popular"],
    image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg"
  },
  {
    title: "Kadai Paneer",
    description: "Fresh cottage cheese cooked in a rich tomato-based gravy with bell peppers. Complete meal with pulav, channa masala, and fresh chapati.",
    emoji: "🧀",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 12,
    category: "veg",
    image: "https://images.food52.com/zirBKZRt4KJi1v8xTDbtvY2J82Y=/1200x900/a46010f2-9c79-48a8-8705-faa2ca19185b--2023-1109_sponsored_milkpep_recipe-final_kadai-paneer_unbranded_3x2_julia-gartland_156.jpg"
  },
  {
    title: "Okra Masala",
    description: "Crispy okra sautéed with onions and aromatic spices. A delightful vegetarian option served with our signature sides.",
    emoji: "🥬",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 12,
    category: "veg",
    isNew: true,
    image: "https://aromaticessence.co/wp-content/uploads/2022/06/punjabi_bhindi_masala_gravy_1.jpg"
  },
  {
    title: "Bisi Bele Bath",
    description: "Traditional Karnataka comfort food - a hearty rice dish with lentils, vegetables, and aromatic spices. A complete meal in itself.",
    emoji: "🍚",
    bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    price: 12,
    category: "others",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/bisi-bele-bath.jpg"
  },
  {
    title: "Andhra Chicken",
    description: "Fiery Andhra-style chicken curry with bold spices and tangy flavors. For those who love authentic South Indian heat.",
    emoji: "🌶️",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    price: 12,
    category: "non-veg",
    image: "https://www.whiskaffair.com/wp-content/uploads/2021/10/Andhra-Chicken-Curry-2-3.jpg"
  },
  {
    title: "Kadai Chicken",
    description: "Tender chicken pieces cooked in a robust kadai gravy with bell peppers and onions. A restaurant favorite.",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    price: 12,
    category: "non-veg",
    image: "https://myfoodstory.com/wp-content/uploads/2021/09/kadai-chicken-1.jpg"
  }
];

const categories = [
  { 
    id: 'biryani', 
    name: 'Biryani Special', 
    icon: '🍗',
    description: 'Aromatic rice dishes',
    color: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'veg', 
    name: 'Vegetarian', 
    icon: '🥬',
    description: 'Plant-based delights',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'non-veg', 
    name: 'Non-Vegetarian', 
    icon: '🌶️',
    description: 'Protein-rich curries',
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'others', 
    name: 'Traditional', 
    icon: '🍚',
    description: 'Regional specialties',
    color: 'from-yellow-500 to-amber-500'
  }
];

const OrderProgress = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { name: 'Choose Category', icon: '🎯' },
    { name: 'Select Items', icon: '🍽️' },
    { name: 'Review Order', icon: '✅' }
  ];

  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: index <= currentStep ? 1 : 0.8,
                opacity: index <= currentStep ? 1 : 0.5
              }}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {index < currentStep ? <Check className="w-6 h-6" /> : step.icon}
              </div>
              <span className={`mt-2 text-sm font-medium transition-colors ${
                index <= currentStep ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                index < currentStep ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ category, isSelected, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 group ${
      isSelected 
        ? 'ring-4 ring-amber-400 shadow-2xl' 
        : 'hover:shadow-xl'
    }`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
    
    <div className="relative bg-white dark:bg-gray-800 p-8 h-48 flex flex-col items-center justify-center text-center">
      {/* Floating icon with animation */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-5xl mb-4 filter drop-shadow-lg"
      >
        {category.icon}
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 transition-colors">
        {category.name}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {category.description}
      </p>
      
      <motion.div 
        className={`w-16 h-1 rounded-full transition-all duration-300 ${
          isSelected ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gray-300 group-hover:bg-amber-400'
        }`}
        layoutId={`category-indicator-${category.id}`}
      />
    </div>

    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
);

const MealCard = ({ meal, onAddToCart }: any) => {
  const [quantity, setQuantity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={meal.image}
          alt={meal.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Price badge */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ scale: isHovered ? 1.1 : 1, opacity: 1 }}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg"
        >
          <span className="text-amber-600 dark:text-amber-500 font-bold text-lg">
            ${meal.price}
          </span>
        </motion.div>
        
        {/* Tags */}
        <div className="absolute top-4 left-4 space-y-2">
          {meal.isNew && (
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg"
            >
              NEW
            </motion.span>
          )}
          {meal.tags?.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0, rotate: 12 }}
              animate={{ scale: 1, rotate: 0 }}
              className="block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-sm font-medium">4.8</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 transition-colors">
            {meal.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
            {meal.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>15-20 min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>Serves 1</span>
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(0, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            
            <motion.span 
              key={quantity}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="w-8 text-center font-bold text-lg"
            >
              {quantity}
            </motion.span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={quantity === 0}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
              quantity > 0
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
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
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-white"
        >
          <div className="text-left">
            <h3 className="font-bold text-lg">Your Order</h3>
            <p className="text-amber-100 text-sm">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-2xl">${total.toFixed(2)}</p>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </div>
        </button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-3 max-h-60 overflow-y-auto"
          >
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-amber-600">${(item.price * item.quantity).toFixed(2)}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Button */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
  const [currentStep, setCurrentStep] = useState(0);
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

  useEffect(() => {
    if (selectedCategory) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [selectedCategory]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Header */}
        <div className="relative pt-12 pb-8 px-4 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl" />
          </div>

          {/* Biryani Bowl Hero Section */}
          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Biryani Bowl Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-8"
            >
              {/* Circular Biryani Image Container */}
              <div className="relative w-96 h-96 mx-auto">
                {/* Glowing ring effect */}
                <motion.div
                  className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 opacity-75"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ filter: 'blur(12px)' }}
                />
                
                {/* Multiple sparkle rings */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-amber-300 rounded-full"
                    style={{
                      top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 50}%`,
                      left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 50}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      rotate: 360
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
                
                {/* Main circular image */}
                <motion.div
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src="https://images.pexels.com/photos/9609868/pexels-photo-9609868.jpeg"
                    alt="Delicious Biryani Bowl"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay gradient for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>
                
                {/* Magical shine effect */}
                <motion.div
                  className="absolute top-8 left-8 w-6 h-6 bg-white/60 rounded-full"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.3, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
                
                {/* Steam Effect */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-8 bg-gradient-to-t from-gray-300 to-transparent rounded-full opacity-60"
                      style={{ left: `${i * 8 - 8}px` }}
                      animate={{
                        y: [0, -20, -40],
                        opacity: [0.6, 0.3, 0],
                        scale: [1, 1.5, 2]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
                
                {/* Floating spices */}
                <div className="absolute inset-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-500 rounded-full"
                      style={{
                        top: `${30 + Math.random() * 40}%`,
                        left: `${30 + Math.random() * 40}%`
                      }}
                      animate={{
                        y: [0, -10, 0],
                        x: [0, Math.random() * 10 - 5, 0],
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.5, 1]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-6xl md:text-8xl font-bold mb-6 text-amber-900 dark:text-amber-100"
              style={{ fontFamily: 'serif' }}
            >
              BIRYANI BOWL
            </motion.h1>

            {/* Order Button */}
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(245, 158, 11, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-amber-500/30 transition-all duration-300"
            >
              <span>ORDER</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.div>
              
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
            </motion.button>

            {offline && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full"
              >
                <WifiOff size={16} />
                <span className="text-sm font-medium">
                  You're offline. Changes will sync when you're back online.
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;