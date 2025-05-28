import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, total, deliveryInfo, setDeliveryInfo, clearCart } = useCart();
  const [address, setAddress] = useState(deliveryInfo?.address || '');
  const [instructions, setInstructions] = useState(deliveryInfo?.instructions || '');
  const [phone, setPhone] = useState(deliveryInfo?.phone || '');

  const handleWhatsAppOrder = () => {
    if (!address.trim()) {
      alert('Please enter your delivery address');
      return;
    }

    const orderDetails = items.map(item => 
      `• ${item.title} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`
    ).join('\n');

    const message = `🛍️ *New Order*\n\n*Items:*\n${orderDetails}\n\n*Total: $${total.toFixed(2)}*\n\n*Delivery Details:*\n📍 Address: ${address}\n${instructions ? `📝 Instructions: ${instructions}\n` : ''}${phone ? `📞 Phone: ${phone}` : ''}`;

    // Save delivery info
    setDeliveryInfo({ address, instructions, phone });

    // Open WhatsApp
    window.location.href = `https://wa.me/15185287832?text=${encodeURIComponent(message)}`;

    // Clear cart after order
    clearCart();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Your cart is empty
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              {items.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="border-t dark:border-gray-800 pt-4">
                    <h3 className="font-medium mb-2">Delivery Details</h3>
                    <input
                      type="text"
                      placeholder="Delivery Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 border dark:border-gray-700 rounded mb-2 bg-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number (optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border dark:border-gray-700 rounded mb-2 bg-transparent"
                    />
                    <textarea
                      placeholder="Special Instructions (optional)"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full p-2 border dark:border-gray-700 rounded h-24 bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium"
                >
                  <Send className="w-5 h-5" />
                  Order on WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;