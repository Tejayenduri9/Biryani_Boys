import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Clock, Star, MapPin, Phone, Mail, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import SignIn from '../components/SignIn';

const AnimatedWord = ({ text, delay = 0, className = "" }) => {
  return (
    <motion.span className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.05,
            type: "spring",
            damping: 12,
            stiffness: 100
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

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

const FlipCard = ({ card, isActive, onFlip }) => {
  return (
    <motion.div 
      className="w-full h-[400px] perspective-1000 cursor-pointer"
      onClick={onFlip}
      layout
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isActive ? 180 : 0 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <motion.div 
            className="w-full h-full rounded-2xl overflow-hidden shadow-xl relative group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0">
              <img 
                src={card.image} 
                alt={card.category}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <motion.div 
                className="transform transition-transform duration-300 group-hover:translate-y-[-10px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AnimatedWord 
                  text={card.category}
                  delay={0.3}
                  className="text-3xl font-cormorant text-white mb-2 tracking-wider"
                />
                {card.description && (
                  <motion.p 
                    className="text-white/90 text-sm font-poppins"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {card.description}
                  </motion.p>
                )}
                <motion.p 
                  className="text-amber-400 text-sm mt-4 font-poppins font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Click to see menu items →
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <motion.div 
            className="w-full h-full rounded-2xl p-8 shadow-xl bg-gradient-to-br from-amber-500 to-amber-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="space-y-6 w-full h-full flex flex-col justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {card.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                  }}
                  className="text-center py-4 px-6 bg-white rounded-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <AnimatedWord 
                    text={item}
                    delay={index * 0.1 + 0.2}
                    className="text-2xl font-cormorant text-gray-900 tracking-wider"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SequentialText = () => {
  const [showFood, setShowFood] = useState(true);
  const [showPeople, setShowPeople] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setShowFood(true);
      setShowPeople(false);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowFood(false);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowPeople(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPeople(false);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      sequence();
    };

    sequence();
    return () => {
      setShowFood(false);
      setShowPeople(false);
    };
  }, []);

  return (
    <div className="text-4xl md:text-5xl font-cormorant min-h-[80px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showFood && (
          <motion.div
            key="food"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute"
          >
            {Array.from("food").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="inline-block text-amber-500"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        )}
        {showPeople && (
          <motion.div
            key="people"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute"
          >
            {Array.from("people").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="inline-block text-amber-500"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuSection = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <div className="relative py-20 bg-gradient-to-b from-amber-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center"
          >
            <Utensils className="w-10 h-10 text-amber-600" />
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-amber-600"
            >
              A place where
            </motion.div>
            
            <SequentialText />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              come together to create a memorable experience.
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="w-24 h-1 bg-amber-500 mx-auto"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 10,
              delay: 0.7
            }}
            className="text-6xl font-cormorant text-amber-600"
          >
            {Array.from("Our Menu").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="inline-block"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <FlipCard 
                card={card}
                isActive={activeCard === index}
                onFlip={() => {
                  if (activeCard === index) {
                    setActiveCard(null);
                  } else {
                    setActiveCard(index);
                  }
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const { user } = useAuth();
  const { reviews: allReviews, loading } = useReviews(menuCards);

  const fiveStarReviews = Object.values(allReviews)
    .flat()
    .filter(review => review?.rating === 5)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

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
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-gray-900 relative overflow-hidden">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 1.5
              }}
              className="w-48 h-48 mx-auto rounded-full border-4 border-amber-500 overflow-hidden bg-white relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-amber-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <img
                src="/logo.jpg"
                alt="Biryani Boyz Logo"
                className="w-full h-full object-cover translate-x-1 transform transition-transform duration-700 group-hover:scale-110"
              />
              <motion.div
                className="absolute inset-0 border-4 border-amber-500 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="font-cormorant text-5xl md:text-6xl font-bold text-white tracking-tight"
              >
                <span className="inline-block mr-4">Biryani</span>
                <span className="inline-block bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
                  Boyz
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="font-montserrat text-lg md:text-xl text-gray-300 font-light max-w-3xl mx-auto tracking-wide"
              >
                Experience the authentic flavors of India, crafted with passion and served with love
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                onClick={handleOrderOnline}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-montserrat group relative overflow-hidden rounded-full bg-amber-500 px-8 py-4 text-lg font-medium text-white shadow-xl transition-transform duration-200"
              >
                <span className="relative z-10">Order Online</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </motion.button>

              <motion.a
                href="tel:+15185287832"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="font-montserrat group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-medium text-amber-600 shadow-xl transition-transform duration-200"
              >
                <span className="relative z-10">Call to Order</span>
                <div className="absolute inset-0 bg-amber-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <MenuSection />

      {/* Traditional Meal Section with Parallax */}
      <section className="relative overflow-hidden">
        <div className="zigzag-border relative">
          <div className="h-[60vh] relative">
            <div className="absolute inset-0">
              <img
                src="https://a-us.storyblok.com/f/1004486/0f0921cf4b/dsc_0294.JPG"
                alt="Traditional Meal"
                className="w-full h-full object-cover"
                style={{ 
                  transform: 'scale(1.1)',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: -1
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto text-center"
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-cormorant font-bold text-white leading-tight tracking-wider px-4 py-6 bg-black/30 backdrop-blur-sm rounded-lg">
                  EXPERIENCE THE AUTHENTIC QUALITY OF A TRADITIONAL MEAL SERVED ON A MEAL BOX
                </h2>
              </motion.div>
            </div>
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
            What Our <span className="text-gradient">Customers</span> Say
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
              </div>
            ) : fiveStarReviews.length > 0 ? (
              fiveStarReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-amber-500 transform hover:rotate-12 transition-transform duration-300">
                      {review.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{review.user.name}</h3>
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
                    "{review.comment}"
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {review.timestamp?.toDate().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 dark:text-gray-400 py-10">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
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