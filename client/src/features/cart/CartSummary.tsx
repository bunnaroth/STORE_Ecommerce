import React from 'react';
import { Button } from '../../components/common/Button.js';

interface CartSummaryProps {
  formattedTotal: string;
  itemCount: number;
  onCheckout: () => void;
  disabled?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  formattedTotal,
  itemCount,
  onCheckout,
  disabled
}) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-left">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3.5 text-sm font-medium text-gray-600">
        <div className="flex justify-between">
          <span>Total Selected Items</span>
          <span className="text-gray-900 font-bold">{itemCount} units</span>
        </div>
        
        <div className="flex justify-between">
          <span>Shipping & Delivery</span>
          <span className="text-emerald-600 font-bold">FREE</span>
        </div>

        <hr className="border-gray-50 my-2" />

        <div className="flex justify-between text-base font-black text-gray-900 pt-1">
          <span>Estimated Total</span>
          <span className="text-xl font-black text-gray-900">{formattedTotal}</span>
        </div>
      </div>

      <Button
        variant="primary"
        disabled={disabled || itemCount === 0}
        onClick={onCheckout}
        className="w-full mt-6 py-3.5 text-sm font-bold tracking-wide shadow-md"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
};
