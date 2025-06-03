import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SignIn from '../components/SignIn';

const images = [
  "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg",
  "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
  "https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg",
  "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg",
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

const LandingPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [showSignIn, setShowSignIn] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="relative h-screen">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <motion.div
              key={image}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={image}
                alt={`Food ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-40 h-40 mx-auto rounded-full border-4 border-amber-500 overflow-hidden bg-white"
              >
                <img
                  src="/logo.jpg"
                  alt="Biryani Boyz Logo"
                  className="w-full h-full object-cover translate-x-1"
                />
              </motion.div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              Biryani <span className="text-amber-500">Boyz</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
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
                className="bg-[#fdf6e3] dark:bg-gray-900 p-8 rounded-xl shadow-xl"
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
                        <span key={i} className="text-yellow-500">★</span>
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
      </footer>
    </div>
  );
};

export default LandingPage;