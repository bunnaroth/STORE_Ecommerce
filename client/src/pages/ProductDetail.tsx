import { useNavigate, useParams } from "react-router"
import { ProductModel } from "../types/product";
import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { productApi } from "../api/productApi";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Button } from "../components/common/Button";
import { ProductDetailView } from "../features/products/ProductDetail";

export const ProductDetail: React.FC = () => { 
    const { id } = useParams<{id: string}>(); 
    const navigate = useNavigate(); 

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
        try { 
            await addToCart(productId, quantity)

            alert("Added to your cart.");
        } catch (err: any) { 
            alert(err.message);
        }
    };

    if (isLoading) { 
        return ( 
            <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
                <LoadingSpinner/>
            </div>
        );
    }

    return ( 
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* back to catalog nav guide bar */}
            <div className="mb-6 text-left">
                <Button variant="secondary" size="sm" onClick={() => navigate('/products')} className="shadow-xs font-semibold">← Back</Button>
            </div>

            {error || !product ? ( 
                <div className="rounded-2xl bg-red-50 p-6 border border-red-100 text-sm font-medium text-red-600 text-left animate-pulse"> 
                    {error || 'Requested item product record was not found.'}
                </div>
            ) : ( 
                <ProductDetailView product={product} onAddToCart={handleAddToCart}/>
            )}
        </div>
    );
};