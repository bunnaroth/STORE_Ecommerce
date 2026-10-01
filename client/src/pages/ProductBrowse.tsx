import { useEffect, useState } from "react"
import { ProductModel } from "../types/product"
import { productApi } from "../api/productApi";
import { ProductSearch } from "../features/products/ProductSearch";
import { ProductFilters } from "../features/products/ProductFilters";
import { ProductList } from "../features/products/ProductList";
import { useDebounce } from "../hooks/useDebounce";
import { useCart } from "../hooks/useCart";

export const ProductBrowse: React.FC = () => { 

    const { addToCart } = useCart(); 

    const [products, setProducts] = useState<ProductModel[]>([]); 
    const [categories, setCategories] = useState<string[]>([]); 
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
    const [searchQuery, setSearchQuery] = useState<string>(''); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);
    const debouncedSearchQuery = useDebounce(searchQuery, 400);

    useEffect(() => { 
        const fetchCatalogData = async () => { 
            try { 
                setIsLoading(true); 
                setError(null); 

                const fetchedProducts = await productApi.getAll( 
                    selectedCategory || undefined, 
                    debouncedSearchQuery || undefined
                );

                setProducts(fetchedProducts); 

                // Create the category list if it doesn't exist yet
                if (categories.length === 0 && fetchedProducts.length > 0) { 
                    const uniqueCategories = Array.from( 
                        new Set(fetchedProducts.map((p) => p.category))
                    );
                    setCategories(uniqueCategories); 
                }
            } catch (err: any) { 
                setError(err.message || 'Failed to retrieve storefront catalog items.'); 
            } finally { 
                setIsLoading(false);
            }
        };

        fetchCatalogData(); 
    }, [selectedCategory, debouncedSearchQuery, categories.length]);

    const handleAddToCartSecure = async (productId: number) => {
        try {
            await addToCart(productId, 1);

            alert("Added to your cart.");
        } catch (err: any) {
            alert(err.message);
        }
    };

    return ( 
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center border-b border-gray-100 pb-6 mb-8 gap-4">
                <ProductSearch value={searchQuery} onChange={setSearchQuery}/>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 ">
                {/* sidebar nav column*/}
                <div className="lg:col-span-1">
                    <ProductFilters 
                        categories={categories} 
                        selectedCategory={selectedCategory} 
                        onSelectedCategory={setSelectedCategory}
                />
                </div>

                <div className="lg:col-span-3">
                    {error ? ( 
                        <div className="rounded-2xl bg-red-50 p-4 border  border-red-100 text-sm font-medium text-red-600 text-left animate-pulse">
                            {error}
                        </div>
                    ) : ( 
                        <ProductList products={products} isLoading={isLoading} onAddToCart={handleAddToCartSecure}/>
                    )}
                </div>
            </div>
        </div>
    );
};