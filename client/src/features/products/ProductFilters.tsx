interface ProductFiltersProps { 
    categories: string[]; 
    selectedCategory: string | null; 
    onSelectedCategory: (category: string | null) => void; 
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({categories, selectedCategory, onSelectedCategory}) => { 
    return ( 
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-left">
            <h3 className="text-sm text-center font-bold uppercase tracking-wider text-gray-400 mb-4">
                Categories
            </h3>

            <div className="flex flex-col space-y-1.5">
                <button onClick={() => onSelectedCategory(null)} className={`w-full rounded-xl px-4 py-1.5 text-left text-sm font-medium transition-all duration-200
                    ${selectedCategory === null ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                    All products
                </button>

                {categories.map((category) => ( 
                    <button key={category}
                        onClick={() => onSelectedCategory(category)}
                        className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 capitalize
                        ${selectedCategory === category ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};