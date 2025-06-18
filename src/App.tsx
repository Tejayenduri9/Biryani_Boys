import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SidebarProvider } from './components/SidebarContext';
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

  return (
    <Routes>
      {/* ✅ Public Routes (always accessible) */}
      <Route
        path="/"
        element={
          <CartProvider>
            <LandingPage />
          </CartProvider>
        }
      />
      <Route
        path="/menu"
        element={
          <CartProvider>
            <Menu />
          </CartProvider>
        }
      />

      {/* ✅ Protected Dashboard Route */}
      {user ? (
        <Route
          path="/dashboard/*"
          element={
            <SidebarProvider>
              <CartProvider>
                <Dashboard />
              </CartProvider>
            </SidebarProvider>
          }
        />
      ) : (
        // Optional: restrict access to dashboard
        <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
      )}

      {/* ✅ Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
