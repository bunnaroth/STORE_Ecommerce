import React from 'react';
import { CartItemModel } from '../../types/cart.js';

interface CartItemProps {
  item: CartItemModel;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  disabled?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    onUpdateQuantity,
    disabled
}) => {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 bg-white py-4 text-left last:border-0">
      
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img
            src={item.images[0]}
            alt={item.name}
            className="h-full w-full object-cover object-center"
            loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
          {item.name}
        </h4>
        <span className="mt-0.5 text-xs font-semibold text-gray-500">
          ${item.price.toFixed(2)} each
        </span>
        
        {item.isExceedingStock && (
          <p className="mt-1 text-2xs font-medium text-red-600 animate-pulse">
            Exceeds warehouse limits (Max: {item.stock})
          </p>
        )}

        <div className="mt-3 flex items-center space-x-3">
          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              disabled={disabled}
              className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold text-gray-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              disabled={disabled || item.quantity >= item.stock}
              className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            disabled={disabled}
            className="border-0 bg-transparent p-0 text-xs font-medium text-gray-500 transition-colors hover:text-rose-600 disabled:opacity-40"
          >
            Remove
          </button>

        </div>
      </div>

      <div className="text-right flex flex-col justify-center min-w-17.5">
        <span className="text-sm font-bold text-gray-900">
          {item.formattedSubtotal}
        </span>
      </div>
    </div>
  );
};
