import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserCheck, AlertCircle } from 'lucide-react';

const SignIn: React.FC = () => {
  const { signInWithGoogle, signInAsGuest, authError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGuestSignIn, setIsGuestSignIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      // Error handling is now done in the AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsGuestSignIn(true);
      await signInAsGuest();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Guest sign in error:', error);
      // Error handling is done in AuthContext
    } finally {
      setIsGuestSignIn(false);
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

        {/* Error Message */}
        {authError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-amber-800 dark:text-amber-200 text-sm max-w-md"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}. You can continue as a guest below.</span>
          </motion.div>
        )}

        {/* Sign-In Buttons */}
        <div className="space-y-4 w-full max-w-sm">
          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn || isGuestSignIn}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.5, delay: 1 }}
            className={`flex items-center rounded-lg overflow-hidden shadow-lg transition-all w-full ${
              isSigningIn || isGuestSignIn ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
            }`}
          >
            <div className="bg-white p-3 px-5 flex items-center justify-center">
              <img src="/google.webp" alt="Google" className="w-7 h-7" />
            </div>
            <div className="bg-[#4285F4] text-white px-8 py-3 text-lg font-semibold flex-1 text-center">
              {isSigningIn ? "Signing in..." : "Sign in with Google"}
            </div>
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </motion.div>

          {/* Guest Sign-In Button */}
          <motion.button
            onClick={handleGuestSignIn}
            disabled={isSigningIn || isGuestSignIn}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className={`flex items-center rounded-lg overflow-hidden shadow-lg transition-all w-full ${
              isSigningIn || isGuestSignIn ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
            }`}
          >
            <div className="bg-gray-100 dark:bg-gray-700 p-3 px-5 flex items-center justify-center">
              <UserCheck className="w-7 h-7 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="bg-gray-600 dark:bg-gray-800 text-white px-8 py-3 text-lg font-semibold flex-1 text-center">
              {isGuestSignIn ? "Signing in..." : "Continue as Guest"}
            </div>
          </motion.button>
        </div>

        {/* Guest Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-md"
        >
          <p>
            Guest access allows you to browse the menu and place orders. 
            Sign in with Google to leave reviews and save your preferences.
          </p>
        </motion.div>

        {/* Footer */}
        <p className="text-xs text-gray-500 dark:text-gray-400 pt-8">
          © 2025 Biryani Boyz. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;