import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

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
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 10,
    category: "biryani",
    image: "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg"
  },
  {
    title: "Extra Meat Chicken Biryani",
    description: "Must Pre-order! Served with Pulav, Channa Masala, and Chapati",
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
    image: "https://images.pexels.com/photos/3926135/pexels-photo-3926135.jpeg"
  },
  {
    title: "Okra Masala",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "veg",
    isNew: true,
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  },
  {
    title: "Bisi Bele Bath",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "veg",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  },
  // Non-Veg Meal Box Section
  {
    title: "Andhra Chicken",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "non-veg",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  },
  {
    title: "Kadai Chicken",
    description: "Served with Pulav, Channa Masala, and Chapati",
    price: 12,
    category: "non-veg",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
  }
];

const Menu: React.FC = () => {
  const categories = {
    biryani: "Biryani Special",
    veg: "Veg Meal Box",
    "non-veg": "Non-Veg Meal Box"
  };

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
          {Object.entries(categories).map(([key, title]) => (
            <div key={key} className="space-y-6">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-semibold"
              >
                {title}
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems
                  .filter(item => item.category === key)
                  .map((item) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                    >
                      <div className="relative h-48">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg">
                          <span className="text-amber-600 dark:text-amber-500 font-bold">
                            ${item.price}
                          </span>
                        </div>
                        {item.isNew && (
                          <span className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Menu;