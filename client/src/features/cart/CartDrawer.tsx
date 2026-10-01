import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { CartItem } from './CartItem.js';
import { Button } from '../../components/common/Button.js';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, isLoading, totalItemCount, formattedCartTotal, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-transform duration-300 flex flex-col h-full">
          
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-md font-bold text-gray-900 flex items-center">
              Shopping Cart <span className="px-2.5 py-0.5 text-md font-bold ">({totalItemCount})</span>
            </h2>
            <button 
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 cursor-pointer border-0 bg-transparent"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {isLoading && cartItems.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm font-semibold text-gray-400 animate-pulse">
                Syncing basket parameters...
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <p className="text-sm text-gray-900">Your cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  disabled={isLoading}
                />
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-gray-100 p-5 bg-gray-50/50">
              <div className="flex items-center justify-between text-base font-black text-gray-900 mb-4">
                <span>Total Summary:</span>
                <span className="text-xl text-indigo-600 font-black">{formattedCartTotal}</span>
              </div>
              
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  navigate('/cart');
                }}
                className="w-full py-3.5 text-sm font-bold shadow-md"
              >
                View Full Cart Viewport
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
