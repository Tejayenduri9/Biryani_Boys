import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FloatingOrderButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show button when scrolled 50% of the page
      const scrollPercentage = scrolled / (documentHeight - windowHeight);
      setIsVisible(scrollPercentage >= 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderOnline = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      // Trigger sign-in flow
      const signInEvent = new CustomEvent('showSignIn');
      window.dispatchEvent(signInEvent);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[998]"
        >
          <motion.button
            onClick={handleOrderOnline}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 rounded-l-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300"
          >
            {/* Glowing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-l-full opacity-0 group-hover:opacity-75 transition-opacity duration-300"
              style={{ filter: 'blur(8px)' }}
            />
            
            {/* Sparkle effects */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      initial={{ 
                        x: Math.random() * 40 - 20,
                        y: Math.random() * 40 - 20,
                        scale: 0 
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        duration: 1,
                        delay: i * 0.2,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                animate={{ 
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <ShoppingBag className="w-6 h-6" />
              </motion.div>
              
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold whitespace-nowrap writing-mode-vertical-rl text-orientation-mixed"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                Order Online
              </motion.span>
            </div>

            {/* Pulsing ring effect */}
            <motion.div
              className="absolute inset-0 border-2 border-white/30 rounded-l-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>

          {/* Moving text indicator */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4"
          >
            <motion.div
              animate={{ x: [-10, 0, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap"
            >
              🍽️ Ready to order?
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-white dark:border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingOrderButton;