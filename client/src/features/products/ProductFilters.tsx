interface ProductFiltersProps { 
    categories: string[]; 
    selectedCategory: string | null; 
    onSelectedCategory: (category: string | null) => void; 
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({categories, selectedCategory, onSelectedCategory}) => { 
    return ( 
        <nav aria-label="Product categories" className="w-full text-left">
            <h2 className="mb-3 text-xs font-bold uppercase text-gray-500 lg:mb-4">
                Shop by category
            </h2>

            <div className="flex flex-wrap gap-x-5 border-b border-gray-200 pb-1 lg:flex-col lg:gap-0 lg:border-0 lg:pb-0">
                <button type="button" onClick={() => onSelectedCategory(null)} className={`shrink-0 border-b-2 px-1 py-2 text-left text-sm transition-colors lg:w-full lg:border-b-0 lg:border-l-2 lg:px-3
                    ${selectedCategory === null ? 'border-gray-950 font-bold text-gray-950 lg:bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-950'}`}>
                    All products
                </button>

                {categories.map((category) => ( 
                    <button key={category}
                        type="button"
                        onClick={() => onSelectedCategory(category)}
                        className={`shrink-0 border-b-2 px-1 py-2 text-left text-sm capitalize transition-colors lg:w-full lg:border-b-0 lg:border-l-2 lg:px-3
                        ${selectedCategory === category ? 'border-gray-950 font-bold text-gray-950 lg:bg-gray-50' : 'border-transparent text-gray-600 hover:text-gray-950'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </nav>
    );
};