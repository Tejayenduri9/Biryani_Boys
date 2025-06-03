import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Clock, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SignIn from '../components/SignIn';

const menuCards = [
  {
    category: "Starters Veg & Non-Veg",
    items: [
      "Mokkajonna Vada",
      "Veg Lollipop",
      "Paneer Pepper Fry",
      "Chicken 65",
      "Andhra Apollo Fish",
      "Garala Prawn Vepudu"
    ],
    bgColor: "bg-amber-400"
  },
  {
    category: "Biryani Special",
    description: "Served with Raita, Salan, and Onions",
    items: ["Chicken Biryani", "Extra Meat Chicken Biryani"],
    bgColor: "bg-amber-400"
  },
  {
    category: "Veg Meal Box",
    description: "Served with Pulav, Channa Masala, and Chapati",
    items: ["Kadai Paneer", "Okra Masala"],
    bgColor: "bg-amber-400"
  },
  {
    category: "Non-Veg Meal Box",
    description: "Served with Pulav, Channa Masala, and Chapati",
    items: ["Andhra Chicken", "Kadai Chicken"],
    bgColor: "bg-amber-400"
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

const FlipCard: React.FC<{ card: typeof menuCards[0] }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full h-[400px] perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <motion.div 
            className={`w-full h-full rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center ${card.bgColor}`}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h3 
              className="text-3xl font-bold mb-4 text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {card.category}
            </motion.h3>
            {card.description && (
              <motion.p 
                className="text-white/90"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {card.description}
              </motion.p>
            )}
            <motion.p 
              className="mt-4 text-sm text-white font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Click to see menu items
            </motion.p>
          </motion.div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <motion.div 
            className={`w-full h-full rounded-2xl p-6 shadow-xl ${card.bgColor} flex flex-col items-center justify-center`}
          >
            <motion.div 
              className="space-y-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {card.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center py-2 px-4"
                >
                  <h4 className="font-semibold text-xl text-white">{item}</h4>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
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
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
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
            <p className="text-xl md:text-2xl mb-8">
              Experience Authentic Indian Flavors
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={handleOrderOnline}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-500 text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-amber-600 transition-colors"
              >
                Order Online
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
          </motion.div>
        </div>
      </div>

      {/* Menu Cards Section */}
      <div className="py-20 px-4 bg-gradient-to-b from-amber-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 animate-float"
          >
            Our Menu
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {menuCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <FlipCard card={card} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-20 px-4 bg-white dark:bg-gray-800">
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
                className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-xl"
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
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 px-4">
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