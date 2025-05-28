import React, { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6 text-amber-600 dark:text-amber-500" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="md:pl-64 transition-all duration-300">
        <Header />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;