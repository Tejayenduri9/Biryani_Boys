import React, { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;