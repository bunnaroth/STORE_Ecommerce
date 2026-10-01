import React, { useState } from 'react';
import { LogOut, Menu, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCart } from '../../hooks/useCart.js';
import { CartDrawer } from '../../features/cart/CartDrawer.js';
import { Sidebar } from './Sidebar.js';
import { Button } from '../common/Button.js';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemCount } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            <div className="flex items-center gap-3 lg:gap-8">
              <button
                type="button"
                aria-label="Open navigation menu"
                aria-expanded={isSidebarOpen}
                aria-controls="mobile-navigation"
                onClick={() => setIsSidebarOpen(true)}
                className="grid size-10 place-items-center rounded-xl border-0 bg-transparent text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 lg:hidden"
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              <Link to="/" className="text-xl font-black tracking-tight text-gray-900 group">
                <img src="logo.png" alt='STORE' className='w-auto h-12 transition-opacity group-hover:opacity-80'/>
              </Link>
              
              <div className="hidden lg:flex items-center space-x-1">
                <Link to="/products" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                  Shop
                </Link>
                <Link to="/about-us" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                  About Us
                </Link>
                <Link to="/contact" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                aria-label="Open shopping cart"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center gap-2 rounded-xl border-0 bg-transparent p-2.5 text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                <ShoppingCart size={19} aria-hidden="true" />
                <span className="hidden text-sm font-semibold lg:inline">Cart</span>
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white `">
                    {totalItemCount}
                  </span>
                )}
              </button>

              <hr className="hidden h-6 w-px border-0 bg-gray-200 lg:block" />

              {isAuthenticated && user ? (
                <div className="hidden items-center space-x-4 lg:flex">
                    <Link to="/profile" className='text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors'>
                      {user.firstName}
                    </Link>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleLogoutClick}
                      className="group gap-2 rounded-full border-indigo-100 bg-indigo-50/70 px-4 text-indigo-800 shadow-none hover:border-indigo-200 hover:bg-indigo-100 hover:text-indigo-900"
                    >
                      <LogOut size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      Sign out
                    </Button>
                </div>
              ) : (
                <div className="hidden items-center space-x-2 lg:flex">
                  <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2">
                    Sign In
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="shadow-xs font-bold"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={() => {
          setIsSidebarOpen(false);
          handleLogoutClick();
        }}
      />
    </>
  );
};
