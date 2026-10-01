import { useState } from "react";
import { ProductModel } from "../../types/product";
import { Button } from "../../components/common/Button";

interface ProductDetailProps { 
    product: ProductModel; 
    onAddToCart?: (productId: number, quantity: number) => void | Promise<void>;
}

export const ProductDetailView: React.FC<ProductDetailProps> =({product, onAddToCart}) => { 
    const [quantity, setQuantity] = useState<number>(1); 
    const [isAdding, setIsAdding] = useState<boolean>(false); 

    const handleIncrement = () => { 
        if (quantity < product.stock) setQuantity(prev => prev + 1); 
    };

    const handleDecrement = () => { 
        if (quantity > 1) setQuantity(prev => prev - 1); 
    };

    const handleAddToCart = async () => {
        if (!onAddToCart) return;

        setIsAdding(true);
        try {
            await onAddToCart(product.id, quantity);
        } finally {
            setIsAdding(false);
        }
    };

    return ( 
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                {/* Product Image */}
                <div className="relative aspect-auto w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center"
                        loading="eager"
                    />

                    {product.isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-xs">
                            <p className="text-sm font-semibold text-red-500">
                                This item is currently out of stock.
                            </p>
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="flex flex-col justify-center">

                    <p className="text-sm font-medium uppercase tracking-wide text-indigo-500">
                        {product.category}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-2xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                        {product.description}
                    </p>

                    {!product.isOutOfStock && (
                        <div className="mt-8 flex flex-col gap-4">

                            <span className="text-sm font-semibold text-gray-700">
                                Quantity:
                            </span>

                            <div className="flex items-center">
                                <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1 || isAdding}
                                        className="px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        -
                                    </button>

                                    <span className="w-12 text-center text-sm font-bold text-gray-900">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={handleIncrement}
                                        disabled={quantity >= product.stock || isAdding}
                                        className="px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        +
                                    </button>
                                </div>

                                <span className="ml-3 text-xs font-medium text-gray-400">
                                    {product.stock} units available
                                </span>
                            </div>

                            <Button 
                                size="sm" 
                                disabled={product.isOutOfStock || !onAddToCart}
                                isLoading={isAdding}
                                onClick={() => void handleAddToCart()}
                            >
                                Add to Cart
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};