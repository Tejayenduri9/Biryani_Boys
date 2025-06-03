import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Clock, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SignIn from '../components/SignIn';

const menuShowcase = [
  {
    title: "Chicken Biryani",
    price: "$10.00",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg",
    rating: 4.9,
    category: "Signature Dish",
    description: "Fragrant basmati rice cooked with tender chicken pieces and aromatic spices"
  },
  {
    title: "Kadai Paneer",
    price: "$12.00",
    image: "https://images.food52.com/zirBKZRt4KJi1v8xTDbtvY2J82Y=/1200x900/a46010f2-9c79-48a8-8705-faa2ca19185b--2023-1109_sponsored_milkpep_recipe-final_kadai-paneer_unbranded_3x2_julia-gartland_156.jpg",
    rating: 4.8,
    category: "Vegetarian Special",
    description: "Cottage cheese cubes cooked with bell peppers in a spicy tomato gravy"
  },
  {
    title: "Andhra Chicken",
    price: "$12.00",
    image: "https://www.whiskaffair.com/wp-content/uploads/2021/10/Andhra-Chicken-Curry-2-3.jpg",
    rating: 4.7,
    category: "Chef's Special",
    description: "Spicy Andhra-style chicken curry with authentic coastal flavors"
  }
];

const reviews = [
  {
    name: "John D.",
    rating: 5,
    text: "Best biryani in town! The flavors are authentic and the portion size is generous.",
    date: "2 days ago",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  },
  {
    name: "Sarah M.",
    rating: 5,
    text: "Amazing food and great service. The Andhra Chicken is a must-try!",
    date: "1 week ago",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
  },
  {
    name: "Mike R.",
    rating: 5,
    text: "Finally found authentic Indian cuisine. The Bisi Bele Bath is outstanding!",
    date: "2 weeks ago",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
  }
];

const FlipCard: React.FC<{ item: typeof menuShowcase[0] }> = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-96 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      initial={false}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="relative w-full h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-2/3 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="text-amber-400 text-sm font-medium mb-2 block">
                {item.category}
              </span>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-amber-400">{item.price}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{item.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-amber-600 dark:bg-amber-700 rounded-2xl p-6 flex flex-col justify-center items-center text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">{item.title}</h3>
            <p className="text-lg text-center mb-6">{item.description}</p>
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">{item.price}</p>
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg">{item.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LandingPage: React.FC = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useAuth();

  const handleOrderOnline = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      setShowSignIn(true);
    }
  };

  if (showSignIn) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
        
        {/* Background Animation */}
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <img
            src="https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-20 text-white text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 mx-auto rounded-full border-4 border-amber-500 overflow-hidden bg-white mb-6"
            >
              <img
                src="/logo.jpg"
                alt="Biryani Boyz Logo"
                className="w-full h-full object-cover translate-x-1"
              />
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              Biryani <span className="text-amber-500">Boyz</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Experience Authentic Indian Flavors
            </p>
          </motion.div>

          {/* Menu Cards */}
          <div className="max-w-6xl mx-auto mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-8"
            >
              Our Signature Dishes
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
              {menuShowcase.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <FlipCard item={item} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button
              onClick={handleOrderOnline}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-amber-500 text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              Order Online
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.span>
            </motion.button>
            <motion.a
              href="tel:+15185287832"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-amber-600 px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
            >
              Call to Order
            </motion.a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full p-1">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-2 h-2 bg-white rounded-full mx-auto"
            />
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            What Our Customers Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  "{review.text}"
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {review.date}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Social Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              <motion.a
                href="https://instagram.com/biryaniboyz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-amber-600 hover:text-amber-700"
              >
                <Instagram size={24} />
              </motion.a>
              <motion.a
                href="https://facebook.com/biryaniboyz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="text-amber-600 hover:text-amber-700"
              >
                <Facebook size={24} />
              </motion.a>
            </div>
          </div>

          {/* Hours */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">Hours of Operation</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-end gap-2">
                <Clock size={20} className="text-amber-600" />
                <p>Thursday & Friday</p>
              </div>
              <p className="font-medium">Lunch: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>© 2025 Biryani Boyz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;