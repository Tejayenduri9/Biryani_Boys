import React, { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Cart from './Cart';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fdf6e3] dark:bg-gray-900 text-black dark:text-white">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#fdf6e3] dark:bg-gray-900 shadow">
        <Header onCartClick={() => setIsCartOpen(true)} />
      </div>

      {/* Main Content */}
      <main className="p-4">{children}</main>

      {/* Cart */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Layout;
