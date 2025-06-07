import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SidebarProvider } from './components/SidebarContext'; // ✅ Import sidebar context
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import LandingPage from './pages/LandingPage';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdf6e3] dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <SidebarProvider> {/* ✅ Wrap here */}
      <CartProvider>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </CartProvider>
    </SidebarProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
