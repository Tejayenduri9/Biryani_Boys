import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      // Error handling is now done in AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen overflow-hidden bg-[#fdf6e3] dark:bg-gray-900 text-black dark:text-white">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center w-full px-6 py-8 space-y-8"
      >
        {/* Logo with Halo and Animation */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-400 blur-lg opacity-25 z-0"></div>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ rotateZ: 1.5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 120, damping: 8, delay: 0.3 }}
            className="relative z-10 w-72 h-72 md:w-80 md:h-80 rounded-full border-[6px] border-black dark:border-white overflow-hidden shadow-2xl flex items-center justify-center bg-white p-2 hover:shadow-[0_0_20px_rgba(255,165,0,0.6)] transition-transform duration-300 ease-in-out"
          >
            <img
              src="/logo.jpg"
              alt="Biryani Boyz Logo"
              className="object-contain w-full h-full translate-x-2"
            />
          </motion.div>
        </div>

        {/* Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-4xl font-extrabold text-center"
        >
          Biryani Boyz
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center space-y-2 max-w-md"
        >
          <p className="text-lg font-medium text-amber-600 dark:text-amber-500">
            Explore our delicious menu!
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Sign in to discover authentic Indian flavors and share your dining experiences. Your reviews help us serve you better! 🌟
          </p>
        </motion.div>

        {/* Google Sign-In Button */}
        <motion.button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5, delay: 1 }}
          className={`flex items-center rounded-lg overflow-hidden shadow-lg transition-all ${
            isSigningIn ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
          }`}
        >
          <div className="bg-white p-3 px-5 flex items-center justify-center">
            <img src="/google.webp" alt="Google" className="w-7 h-7" />
          </div>
          <div className="bg-[#4285F4] text-white px-8 py-3 text-lg font-semibold">
            {isSigningIn ? "Signing in..." : "Sign in with Google"}
          </div>
        </motion.button>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 pt-8">
          © 2025 Biryani Boyz. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
