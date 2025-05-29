import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, LogOut, ShoppingBag } from 'lucide-react';

const Header: React.FC<{ onCartClick: () => void }> = ({ onCartClick }) => {
  const { user, signOut } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-4 px-4 sm:px-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="text-lg sm:text-xl font-bold whitespace-nowrap cursor-pointer"
          onClick={() => window.location.href = '/dashboard'}
        >
          Biryani <span className="text-amber-600 dark:text-amber-500">Boyz</span>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        {/* Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCartClick}
          className="relative p-2"
        >
          <ShoppingBag className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </motion.button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
                <User size={16} className="text-amber-600 dark:text-amber-300" />
              </div>
              <span className="font-medium text-sm hidden sm:inline">
                {user.displayName}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut()}
              className="text-sm flex items-center gap-1 px-2 sm:px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;