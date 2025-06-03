import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

interface MenuItem {
  title: string;
  price: number;
  description?: string;
  isNew?: boolean;
  category: string;
  image: string;
}

const menuItems: MenuItem[] = [
  // Biryani Section
  {
    title: "Chicken Biryani",
    description: "Classic Hyderabadi style biryani",
    price: 10,
    category: "biryani",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Must Pre-order!",
    price: 12,
    category: "biryani",
    image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg"
  },
  // Veg Meal Box Section
  {
    title: "Kadai Paneer",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "veg",
    image: "https://images.food52.com/zirBKZRt4KJi1v8xTDbtvY2J82Y=/1200x900/a46010f2-9c79-48a8-8705-faa2ca19185b--2023-1109_sponsored_milkpep_recipe-final_kadai-paneer_unbranded_3x2_julia-gartland_156.jpg"
  },
  {
    title: "Okra Masala",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "veg",
    isNew: true,
    image: "https://aromaticessence.co/wp-content/uploads/2022/06/punjabi_bhindi_masala_gravy_1.jpg"
  },
  // Others Section
  {
    title: "Bisi Bele Bath",
    description: "Traditional Karnataka style rice dish",
    price: 12,
    category: "others",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/bisi-bele-bath.jpg"
  },
  // Non-Veg Meal Box Section
  {
    title: "Andhra Chicken",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "non-veg",
    image: "https://www.whiskaffair.com/wp-content/uploads/2021/10/Andhra-Chicken-Curry-2-3.jpg"
  },
  {
    title: "Kadai Chicken",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "non-veg",
    image: "https://myfoodstory.com/wp-content/uploads/2021/09/kadai-chicken-1.jpg"
  }
];

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addItem } = useCart();
  
  const categories = {
    all: "All Items",
    biryani: "Biryani Special",
    veg: "Veg Meal Box",
    "non-veg": "Non-Veg Meal Box",
    others: "Others"
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-amber-600 dark:text-amber-500">Menu</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our authentic Indian dishes, carefully crafted to bring you the best flavors
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {Object.entries(categories).map(([key, label]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === key
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                layout
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="relative h-56 overflow-hidden group">
                  <motion.img
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg">
                    <span className="text-amber-600 dark:text-amber-500 font-bold">
                      ${item.price}
                    </span>
                  </div>

                  {/* New Badge */}
                  {item.isNew && (
                    <div className="absolute top-4 left-4">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium"
                      >
                        NEW
                      </motion.span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-amber-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transform transition-all duration-300"
                    onClick={() => addItem(item.title, item.price)}
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </motion.button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Menu;