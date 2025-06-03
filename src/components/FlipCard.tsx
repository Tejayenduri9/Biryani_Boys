import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  card: {
    category: string;
    description?: string;
    items: string[];
    bgColor: string;
    image: string;
  };
}

export const FlipCard: React.FC<FlipCardProps> = ({ card }) => {
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
            className="w-full h-full rounded-2xl overflow-hidden shadow-xl relative group"
            whileHover={{ scale: 1.02 }}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={card.image} 
                alt={card.category}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
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
                className="text-amber-400 text-sm mt-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Click to see menu items →
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
                  className="text-center py-4 px-6 bg-white/10 backdrop-blur-sm rounded-lg transform hover:scale-105 transition-transform duration-300"
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