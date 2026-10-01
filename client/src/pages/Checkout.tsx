import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { CheckoutForm } from '../features/checkout/CheckoutForm.js';
import { Button } from '../components/common/Button.js';

export const Checkout: React.FC = () => {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-6 mb-8 gap-4 text-left">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Checkout Secure
            </h1>
        </div>

        <div className="flex items-center gap-2">
            <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/cart')}
            className="shadow-xs font-semibold"
            >
            ← Modify Basket Selection
            </Button>
        </div>
        </div>

        <CheckoutForm />
    </div>
    );
};
