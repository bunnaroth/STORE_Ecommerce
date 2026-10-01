import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button.js';
import bannerImage from "../images/banner.png";
import smallBannerImage from "../images/sm-banner.png";
import { CategoryNav } from '../components/layout/CategoryNav.js';
import { useAuth } from '../hooks/useAuth.js';
import { FeaturedProducts } from '../features/products/FeaturedProducts.js';
import { PromotionalCarousel } from '../components/layout/PromotionalCarousel.js';
import { WhyShopWithUs } from '../components/layout/Trust.js';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <>
    <div id="about" className="relative isolate min-h-125 scroll-mt-20 overflow-hidden bg-cover bg-center bg-no-repeat font-sans sm:min-h-137.5 lg:min-h-162.5">

      <picture className="absolute inset-0 -z-10">
        <source media="(max-width: 639px)" srcSet={smallBannerImage} />

        <img
          src={bannerImage}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </picture>

      {/* overlay */}
      <div className="absolute inset-0 -z-10"/>
      

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40 items-center justify-between gap-12">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:max-w-xl text-left">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <span className="py-1 text-xs font-semibold uppercase leading-6 text-indigo-600 tracking-wider">
              New Collection
            </span>
          </div>
          
          <h1 className="mt-10 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl leading-none">
            Modern Styles.<span className="text-indigo-600"> Everyday Essentials.</span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-500 hidden lg:block">
              Discover a curated collection of high quality clothing, timeless essentials, and modern styles designed for everyday comfort and confidence.
          </p>
          
          <div className="mt-10 flex items-center gap-x-6">
            <Button
              variant="primary"
              onClick={() => navigate('/products')}
              className="px-6 py-3.5 text-base font-bold tracking-wide shadow-lg transition-transform duration-200 hover:scale-[1.02]"
            >
              Explore Products
            </Button>
            
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-bold leading-6 text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer border-0 bg-transparent"
              >
                Create Account &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <CategoryNav/>
      </div>

    </div>
    <FeaturedProducts />
    <PromotionalCarousel />
    <WhyShopWithUs />
    </>
  );
};
