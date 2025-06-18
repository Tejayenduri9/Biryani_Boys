import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      let bottom = 0;

      if (heroSection) {
        bottom = heroSection.getBoundingClientRect().bottom;
        setShowNavbar(bottom <= window.innerHeight * 0.2);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', type: 'anchor', href: '#home' },
    { name: 'Menu', type: 'route', to: '/menu' },
    { name: 'About', type: 'anchor', href: '#about' },
    { name: 'Catering Services', type: 'anchor', href: '#contact' },
    { name: 'Contact', type: 'anchor', href: '#contact' },
  ];

  if (!showNavbar) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[999] h-16 md:h-20 pointer-events-none" />
    );
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[999] w-full bg-white shadow-md dark:bg-gray-900 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Title */}
          <div className="flex items-center gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full border-2 border-amber-500 overflow-hidden bg-white">
                <img
                  src="/logo.jpg"
                  alt="Biryani Boyz"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-bold font-cormorant text-gray-900 dark:text-white">
                Biryani <span className="text-amber-500">Boyz</span>
              </h1>
            </motion.div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => {
              const delayProps = {
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.1 },
              };

              return item.type === 'route' ? (
                <motion.div key={item.name} {...delayProps}>
                  <Link
                    to={item.to!}
                    className="font-montserrat font-medium text-gray-900 dark:text-white hover:text-amber-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={item.name}
                  href={item.href}
                  {...delayProps}
                  className="font-montserrat font-medium text-gray-900 dark:text-white hover:text-amber-500 transition-colors"
                >
                  {item.name}
                </motion.a>
              );
            })}
          </nav>

          {/* Phone + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <motion.a
              href="tel:+15185287832"
              whileHover={{ scale: 1.05 }}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">(518) 528-7832</span>
            </motion.a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-amber-500 rounded-md text-gray-900 dark:text-white bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 transition-colors"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item, index) => {
                const delayProps = {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: index * 0.1 },
                };

                return item.type === 'route' ? (
                  <motion.div key={item.name} {...delayProps}>
                    <Link
                      to={item.to!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-[16px] font-medium text-gray-800 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    {...delayProps}
                    className="block px-3 py-2 text-[16px] font-medium text-gray-800 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {item.name}
                  </motion.a>
                );
              })}

              <motion.a
                href="tel:+15185287832"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 rounded-md w-full transition"
              >
                <Phone className="w-4 h-4" />
                <span>(518) 528-7832</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
