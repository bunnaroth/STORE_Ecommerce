import React from 'react';
import { LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isOpen) return null;

  return (
    <div id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-0 z-50 overflow-hidden lg:hidden font-sans">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 left-0 flex max-w-full pr-10">
        <div className="w-screen max-w-xs transform bg-white shadow-2xl transition-transform duration-300 flex flex-col h-full text-left">
          
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <span className="text-lg font-black tracking-tight text-gray-900">
              MENU
            </span>
            <button 
              type="button"
              aria-label="Close navigation menu"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 cursor-pointer border-0 bg-transparent"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/products" 
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                Shop
              </Link>
              <Link
                to="/about-us"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                Contact
              </Link>

              <div className="my-3 border-t border-gray-100" />

              <Link
                to="/cart"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                Cart
              </Link>
              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-bold text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
