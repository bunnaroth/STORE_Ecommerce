import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { Button } from '../components/common/Button.js';

export const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
   
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 font-sans">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white py-16 px-6 text-center shadow-xl max-w-2xl mx-auto">
        
        <div className="rounded-full bg-emerald-50 p-5 mb-6 text-emerald-600 ring-8 ring-emerald-50/50">
          <svg
            className="h-10 w-10 stroke-current fill-none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Payment Processed Successfully.
        </h1>
        
        <p className="mt-3 text-base text-gray-500 max-w-md">
          Thank you for your order.
        </p>

        {sessionId && (
          <div className="mt-6 rounded-xl bg-gray-50 p-3.5 border border-gray-100 w-full max-w-sm text-left">
            <span className="text-3xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Stripe Reference Session Token
            </span>
            <code className="text-xs font-mono font-bold text-gray-700 block truncate">
              {sessionId}
            </code>
          </div>
        )}

        <hr className="border-gray-100 w-full my-8" />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/products')}
            className="w-full sm:w-auto px-6 py-3 font-semibold shadow-md transition-all duration-200 active:scale-95"
          >
            Continue Shopping Catalog
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 font-semibold border-gray-200"
          >
            Go Back Home
          </Button>
        </div>

      </div>
    </div>
  );
};
