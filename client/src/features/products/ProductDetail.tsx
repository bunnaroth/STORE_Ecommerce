import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { ProductModel } from "../../types/product";
import { Button } from "../../components/common/Button";

interface ProductDetailProps { 
    product: ProductModel; 
    onAddToCart?: (productId: number, quantity: number) => void | Promise<void>;
}

export const ProductDetailView: React.FC<ProductDetailProps> =({product, onAddToCart}) => { 
    const [quantity, setQuantity] = useState<number>(1); 
    const [isAdding, setIsAdding] = useState<boolean>(false); 
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleIncrement = () => { 
        if (quantity < product.stock) setQuantity(prev => prev + 1); 
    };

    const handleDecrement = () => { 
        if (quantity > 1) setQuantity(prev => prev - 1); 
    };

    const handleAddToCart = async () => {
        if (!onAddToCart) return;

        setIsAdding(true);
        setFeedback(null);
        try {
            await onAddToCart(product.id, quantity);
        } catch (error) {
            setFeedback(error instanceof Error ? error.message : 'Could not add this item. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-14">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 sm:aspect-[5/4] lg:aspect-[4/5]">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                />
                <span className={`absolute left-4 top-4 px-3 py-2 text-xs font-bold uppercase ${product.isOutOfStock ? 'bg-white text-gray-600' : 'bg-white text-emerald-800'}`}>
                    {product.isOutOfStock ? 'Sold out' : `${product.stock} available`}
                </span>
            </div>

            <section className="flex flex-col text-left lg:sticky lg:top-28 lg:self-start">
                <p className="text-sm font-bold uppercase text-indigo-600">{product.category}</p>
                <h1 className="mt-3 text-4xl font-black leading-[1.02] text-gray-950 sm:text-5xl">{product.name}</h1>
                <p className="mt-5 text-2xl font-semibold tabular-nums text-gray-950">{product.formattedPrice}</p>
                <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">{product.description}</p>

                <div className="mt-7 border-y border-gray-200 py-5">
                    <p className={`text-sm font-semibold ${product.isOutOfStock ? 'text-gray-500' : 'text-emerald-800'}`}>
                        {product.isOutOfStock ? 'Currently unavailable' : 'In stock and ready to go'}
                    </p>
                </div>

                {!product.isOutOfStock && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between gap-4">
                            <span id="product-quantity-label" className="text-sm font-bold text-gray-800">Quantity</span>
                            <div aria-labelledby="product-quantity-label" className="flex h-11 items-center border border-gray-300">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    onClick={handleDecrement}
                                    disabled={quantity <= 1 || isAdding}
                                    className="grid size-10 place-items-center text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                                >
                                    <Minus size={15} aria-hidden="true" />
                                </button>
                                <output aria-live="polite" className="w-10 text-center text-sm font-bold tabular-nums text-gray-950">
                                    {quantity}
                                </output>
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    onClick={handleIncrement}
                                    disabled={quantity >= product.stock || isAdding}
                                    className="grid size-10 place-items-center text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40"
                                >
                                    <Plus size={15} aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="mt-5 w-full rounded-md"
                            disabled={!onAddToCart}
                            isLoading={isAdding}
                            onClick={() => void handleAddToCart()}
                        >
                            {isAdding ? 'Adding to cart...' : 'Add to cart'}
                        </Button>
                        {feedback && (
                            <p role="alert" className="mt-3 text-sm text-red-700">
                                {feedback}
                            </p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};