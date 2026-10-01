interface ProductSearchProps { 
    value: string; 
    onChange: (value: string) => void; 
    placeholder?: string; 
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ 
    value, 
    onChange, 
    placeholder = 'Search items',
}) => { 
    return ( 
        <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>

            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder= {placeholder} 
                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 
                        placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
        </div>
    );
};