import React from "react";

const categories = [
  "Accessories",
  "Shorts",
  "Pants",
  "Jeans",
  "Jackets",
  "Hoodies",
  "Shirts",
  "T-Shirts",
];

export const CategoryNav: React.FC = () => {
  const multipliedCategories = [...categories, ...categories, ...categories, ...categories];

  return (
    <nav id="categories" aria-label="Shop categories" className="relative w-full overflow-hidden border-y border-gray-200 bg-gray-50 scroll-mt-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-gray-50 to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-gray-50 to-transparent sm:w-24" />
      <div className="animate-category-scroll py-2.5">
        {multipliedCategories.map((category, index) => (
          <span
            key={`${category}-${index}`}
            aria-hidden={index >= categories.length ? "true" : undefined}
            className="group inline-flex shrink-0 items-center gap-4 px-5 py-2 text-xs font-bold uppercase text-gray-600 transition-colors hover:text-indigo-600 sm:px-8 sm:text-sm"
          >
            <span className="size-1.5 rotate-45 bg-indigo-500 transition-transform group-hover:rotate-90" aria-hidden="true" />
            {category}
          </span>
        ))}
      </div>
    </nav>
  );
};
