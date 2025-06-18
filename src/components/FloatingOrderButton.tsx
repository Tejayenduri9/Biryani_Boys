import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
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
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-[998]"
        >
          <motion.button
            onClick={handleOrderOnline}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative group w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full shadow-2xl hover:shadow-amber-500/40 transition-all duration-300 flex flex-col items-center justify-center"
          >
            {/* Cute glowing background effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-pink-400 to-amber-400 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              style={{ filter: 'blur(12px)' }}
            />
            
            {/* Floating hearts on hover */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ 
                        x: 0,
                        y: 0,
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 60,
                        y: -40 - Math.random() * 20,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Sparkle effects around the circle */}
            <AnimatePresence>
              {isHovered && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-white rounded-full"
                      style={{
                        top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                        left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Main icon with cute bounce */}
            <motion.div
              animate={{ 
                rotate: isHovered ? [0, -15, 15, 0] : 0,
                scale: isHovered ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 300
              }}
              className="relative z-10 mb-1"
            >
              <ShoppingBag className="w-6 h-6 text-white drop-shadow-lg" />
            </motion.div>

            {/* "Order Now" text */}
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 0.4,
                type: "spring"
              }}
              className="relative z-10 text-white text-[10px] font-bold leading-tight text-center drop-shadow-lg"
            >
              Order<br />Now
            </motion.div>

            {/* Cute pulsing ring effect */}
            <motion.div
              className="absolute inset-0 border-3 border-white/40 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.1, 0.4]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Secondary pulsing ring */}
            <motion.div
              className="absolute inset-0 border-2 border-amber-200/60 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Cute gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent rounded-full" />
            
            {/* Shine effect */}
            <motion.div
              className="absolute top-2 left-2 w-3 h-3 bg-white/30 rounded-full"
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingOrderButton;