import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CheckoutForm } from '../features/checkout/CheckoutForm.js';

export const Checkout: React.FC = () => {
    return (
        <main className="bg-white">
            <header className="bg-black text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20 md:flex-row md:items-end md:justify-between lg:px-12">
                    <div>
                        <p className="text-sm font-bold uppercase text-indigo-300">STORE / Checkout</p>
                        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.98] sm:text-6xl lg:text-7xl">Make it yours.</h1>
                        <p className="mt-5 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                            A few delivery details, then you’ll be on your way.
                        </p>
                    </div>
                    <Link to="/cart" className="inline-flex w-fit items-center gap-2 border-b border-white/50 pb-2 text-sm font-bold text-white transition-colors hover:border-indigo-300 hover:text-indigo-300">
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back
                    </Link>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
                <CheckoutForm />
            </div>
        </main>
    );
};
