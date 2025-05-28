import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import MealCard from '../components/MealCard';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { MealBox } from '../types';

const menuItems: MealBox[] = [
  // Biryani Section
  {
    title: "Regular Chicken Biryani",
    description: "Classic Hyderabadi biryani with tender chicken pieces",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 10,
    category: "biryani",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    title: "Special Mutton Biryani",
    description: "Rich and aromatic biryani with tender mutton pieces",
    emoji: "🍖",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20",
    price: 14,
    category: "biryani",
    image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg"
  },
  // Non-Veg Section
  {
    title: "Butter Chicken",
    description: "Creamy tomato-based curry with tender chicken",
    emoji: "🍗",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    price: 12,
    category: "non-veg",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  },
  {
    title: "Andhra Chicken",
    description: "Spicy Andhra style chicken curry",
    emoji: "🌶️",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    price: 12,
    category: "non-veg",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  },
  // Veg Section
  {
    title: "Paneer Butter Masala",
    description: "Cottage cheese in rich tomato gravy",
    emoji: "🧀",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 10,
    category: "veg",
    image: "https://images.pexels.com/photos/3926135/pexels-photo-3926135.jpeg"
  },
  {
    title: "Dal Makhani",
    description: "Creamy black lentils cooked overnight",
    emoji: "🥘",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    price: 8,
    category: "veg",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  }
];

const Menu: React.FC = () => {
  const { user } = useAuth();
  const { reviews, submitReview, updateReview, deleteReview, getAverageRating } = useReviews(menuItems);
  
  const categories = ["biryani", "non-veg", "veg"];
  
  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Our Menu
        </motion.h1>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category} className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-semibold capitalize"
              >
                {category === "non-veg" ? "Non-Vegetarian" : 
                 category === "veg" ? "Vegetarian" : 
                 "Biryani Special"}
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter(item => item.category === category)
                  .map((item) => (
                    <MealCard
                      key={item.title}
                      meal={item}
                      reviews={reviews[item.title] || []}
                      averageRating={getAverageRating(item.title)}
                      user={user}
                      onSubmitReview={(comment, rating) => submitReview(item.title, comment, rating)}
                      onUpdateReview={(reviewId, comment, rating) => 
                        updateReview(item.title, reviewId, comment, rating)
                      }
                      onDeleteReview={(reviewId) => deleteReview(item.title, reviewId)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Menu;