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
        await addToCart(productId, 1);
    };

    return (
        <main className="bg-white">
            <header className="flex min-h-[15rem] items-end bg-black text-white sm:min-h-[18rem] lg:min-h-[19rem]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-5 py-12 sm:px-8 sm:py-16 md:flex-row md:items-end md:justify-between lg:px-12">
                    <div className="max-w-2xl text-left">
                        <p className="text-sm font-bold uppercase text-indigo-300">The collection</p>
                        <h1 className="mt-4 text-4xl font-black uppercase leading-[0.98] text-white sm:text-6xl">Curated pieces.<br className="hidden sm:block" />Effortless style.</h1>
                    </div>
                    <div className="hidden w-full max-w-md md:block">
                        <ProductSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search the collection" />
                    </div>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 lg:px-12">
                <aside className="min-w-0 text-left">
                    <ProductFilters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectedCategory={setSelectedCategory}
                    />
                </aside>

                <section aria-label="Products" className="min-w-0">
                    <div className="mb-5 md:hidden">
                        <ProductSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search the collection" />
                    </div>
                    <div className="mb-6 flex items-baseline justify-between border-b border-gray-200 pb-3 text-left">
                        <h2 className="text-sm font-bold uppercase text-gray-900">
                            {selectedCategory || 'All products'}
                        </h2>
                    </div>
                    {error ? (
                        <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </p>
                    ) : (
                        <ProductList products={products} isLoading={isLoading} onAddToCart={handleAddToCartSecure} />
                    )}
                </section>
            </div>
        </main>
    );
};