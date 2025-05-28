import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, DeliveryInfo } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  deliveryInfo: DeliveryInfo | null;
  addItem: (title: string, price: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryInfo: (info: DeliveryInfo) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedDeliveryInfo) {
      setDeliveryInfo(JSON.parse(savedDeliveryInfo));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save delivery info to localStorage
  useEffect(() => {
    if (deliveryInfo) {
      localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
    }
  }, [deliveryInfo]);

  const addItem = (title: string, price: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.title === title);
      if (existingItem) {
        return prev.map(item =>
          item.title === title
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: Date.now().toString(), title, price, quantity: 1 }];
    });
    toast.success('Added to cart');
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setDeliveryInfo(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('deliveryInfo');
    toast.success('Cart cleared');
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      deliveryInfo,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setDeliveryInfo,
      total
    }}>
      {children}
    </CartContext.Provider>
  );
};