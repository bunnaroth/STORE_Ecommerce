import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-100 bg-white font-sans mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">

          <div className="space-y-2 text-center">
            <h3 className="text-sm font-black tracking-tight text-gray-900">
              <span className="text-indigo-600">STORE</span>
            </h3>

            <p className="mx-auto max-w-xs text-xs leading-relaxed text-gray-500">
              Modern style. Quality essentials. Made for every day.
            </p>
          </div>

          <div className="space-y-2 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Explore
            </h4>

            <div className="flex flex-col items-center space-y-1.5 text-xs font-medium">
              <Link
                to="/products"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                Shop
              </Link>

              <Link to="/about-us" className="text-gray-600 transition-colors hover:text-indigo-600">
                About Us
              </Link>

              <Link to="/contact" className="text-gray-600 transition-colors hover:text-indigo-600">
                Contact
              </Link>

              <Link
                to="/cart"
                className="text-gray-600 transition-colors hover:text-indigo-600"
              >
                Cart
              </Link>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Secure Payments
            </h4>

            <p className="text-xs text-gray-500">
              Powered by Stripe.
            </p>
          </div>

        </div>
        <div className="mt-4 border-t border-gray-50 pt-3 text-center text-xs text-gray-400">
          <p>&copy; {currentYear} STORE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
