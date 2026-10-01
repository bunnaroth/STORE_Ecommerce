import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CartItem } from '../features/cart/CartItem.js';
import { CartSummary } from '../features/cart/CartSummary.js';
import { Button } from '../components/common/Button.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.js';

export const Cart: React.FC = () => {
  const { 
    cartItems, 
    isLoading, 
    error, 
    totalItemCount, 
    formattedCartTotal, 
    updateQuantity
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    navigate('/checkout');
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6 mb-8 gap-4 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          
        </div>

      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-100 text-sm font-medium text-red-600 text-left animate-pulse">
          {error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 px-4 text-center">
          <div className="rounded-full p-4 mb-4 text-gray-400">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-500 mb-6 ">Your shopping cart is empty.</h3>
          
          <Button
            variant="primary"
            onClick={() => navigate('/products')}
            className="shadow-md font-semibold px-6 py-2.5"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            {cartItems.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onUpdateQuantity={updateQuantity}
                disabled={isLoading}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              formattedTotal={formattedCartTotal}
              itemCount={totalItemCount}
              onCheckout={handleCheckoutRedirect}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
