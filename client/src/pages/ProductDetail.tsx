import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductModel } from "../types/product";
import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { productApi } from "../api/productApi";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ProductDetailView } from "../features/products/ProductDetail";

export const ProductDetail: React.FC = () => { 
    const { id } = useParams<{id: string}>(); 
    const { addToCart} = useCart();

    const [product, setProduct] = useState<ProductModel | null>(null); 
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => { 
        const fetchSingleProduct = async () => { 
            if (!id) return; 

            try { 
                setIsLoading(true); 
                setError(null); 

                const fetchedProduct = await productApi.getById(parseInt(id, 10));
                setProduct(fetchedProduct); 
            } catch (err: any) { 
                setError(err.message || 'Failed to locate the requested product catalog record.');
            } finally { 
                setIsLoading(false); 
            }
        }; 

        fetchSingleProduct(); 
    }, [id]); 

    const handleAddToCart = async (productId: number, quantity: number = 1):Promise<void> => { 
        await addToCart(productId, quantity);
    };

    if (isLoading) { 
        return ( 
            <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
                <LoadingSpinner/>
            </div>
        );
    }

    return (
        <main className="min-h-[60vh] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
                <Link to="/products" className="mb-8 inline-flex items-center gap-2 border-b border-gray-300 pb-1.5 text-sm font-bold text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950">
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back
                </Link>

                {error || !product ? (
                    <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error || 'This product could not be found.'}
                    </p>
                ) : (
                    <ProductDetailView product={product} onAddToCart={handleAddToCart} />
                )}
            </div>
        </main>
    );
};