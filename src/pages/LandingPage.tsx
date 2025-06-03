import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Clock, Star, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SignIn from '../components/SignIn';

const menuCards = [
  {
    category: "Biryani Special",
    description: "Served with Raita",
    items: ["Chicken Biryani", "Extra Meat Chicken Biryani"],
    bgColor: "bg-amber-400",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    category: "Veg Meal Box",
    description: "Served with Pulav, Channa Masala, and Chapati",
    items: ["Kadai Paneer", "Okra Masala"],
    bgColor: "bg-amber-400",
    image: "https://images.food52.com/zirBKZRt4KJi1v8xTDbtvY2J82Y=/1200x900/a46010f2-9c79-48a8-8705-faa2ca19185b--2023-1109_sponsored_milkpep_recipe-final_kadai-paneer_unbranded_3x2_julia-gartland_156.jpg"
  },
  {
    category: "Non-Veg Meal Box",
    description: "Served with Pulav, Channa Masala, and Chapati",
    items: ["Andhra Chicken", "Kadai Chicken"],
    bgColor: "bg-amber-400",
    image: "https://www.whiskaffair.com/wp-content/uploads/2021/10/Andhra-Chicken-Curry-2-3.jpg"
  },
  {
    category: "Others",
    items: ["Bisi Bele Bath"],
    bgColor: "bg-amber-400",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/bisi-bele-bath.jpg"
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
            className="w-full h-full rounded-2xl overflow-hidden shadow-xl relative"
            whileHover={{ scale: 1.02 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={card.image} 
                alt={card.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <motion.h3 
                className="text-3xl font-bold text-white mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {card.category}
              </motion.h3>
              {card.description && (
                <motion.p 
                  className="text-white/90 text-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {card.description}
                </motion.p>
              )}
              <motion.p 
                className="text-amber-400 text-sm mt-4 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Click to see menu items
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <motion.div 
            className="w-full h-full rounded-2xl p-8 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center"
          >
            <motion.div 
              className="space-y-6 w-full"
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
                  className="text-center py-4 px-6 bg-white/10 backdrop-blur-sm rounded-lg"
                >
                  <h4 className="font-semibold text-2xl text-white">{item}</h4>
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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-gray-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              custom={0}
              variants={textVariants}
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 mx-auto rounded-full border-4 border-amber-500 overflow-hidden bg-white relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-amber-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <img
                src="/logo.jpg"
                alt="Biryani Boyz Logo"
                className="w-full h-full object-cover translate-x-1"
              />
            </motion.div>
            
            <div className="space-y-4">
              <motion.h1 
                custom={1}
                variants={textVariants}
                className="text-6xl md:text-7xl font-bold"
              >
                Biryani <span className="text-amber-500">Boyz</span>
              </motion.h1>
              <motion.p 
                custom={2}
                variants={textVariants}
                className="text-xl md:text-2xl text-gray-300"
              >
                Experience Authentic Indian Flavors
              </motion.p>
            </div>

            <motion.div 
              custom={3}
              variants={textVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.button
                onClick={handleOrderOnline}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                Order Online
              </motion.button>
              <motion.a
                href="tel:+15185287832"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-amber-600 px-8 py-4 rounded-lg text-xl font-bold shadow-lg hover:bg-gray-100 transition-all"
              >
                Call to Order
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Our <span className="text-amber-500">Menu</span>
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
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-800 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            What Our <span className="text-amber-500">Customers</span> Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-500 fill-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4 italic">
                  "{review.text}"
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {review.date}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
            <motion.a
              href="tel:+15185287832"
              className="flex items-center gap-3 text-gray-300 hover:text-amber-500 transition-colors"
              whileHover={{ x: 5 }}
            >
              <Phone className="w-5 h-5" />
              <span>+1 (518) 528-7832</span>
            </motion.a>
            <motion.a
              href="mailto:info@biryaniboyz.com"
              className="flex items-center gap-3 text-gray-300 hover:text-amber-500 transition-colors"
              whileHover={{ x: 5 }}
            >
              <Mail className="w-5 h-5" />
              <span>biryaniboyz99@gmail.com</span>
            </motion.a>
          </div>

          {/* Hours */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium">Thursday & Friday</p>
                  <p>10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
            <div className="flex gap-4">
              <motion.a
                href="https://instagram.com/biryaniboyz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white hover:from-amber-600 hover:to-amber-700 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://facebook.com/biryaniboyz"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white hover:from-amber-600 hover:to-amber-700 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-400 relative">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm"
          >
            © 2025 Biryani Boyz. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;