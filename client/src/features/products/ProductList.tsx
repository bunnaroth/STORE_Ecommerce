import React, { useState } from "react";
import { ProductModel } from "../../types/product";
import { Button } from "../../components/common/Button";
import { Link } from "react-router-dom";

interface ProductListProps { 
    products: ProductModel[]; 
    onAddToCart?: (productId: number) => void | Promise<void>;
    isLoading?: boolean; 
}

export const ProductList: React.FC<ProductListProps> = ({ products, isLoading, onAddToCart }) => {
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ productId: number; message: string } | null>(null);

  const handleAddToCart = async (productId: number) => {
    if (!onAddToCart) return;

    setAddingProductId(productId);
    setFeedback(null);
    try {
      await onAddToCart(productId);
    } catch (error) {
      setFeedback({
        productId,
        message: error instanceof Error ? error.message : 'Could not add this item. Please try again.',
      });
    } finally {
      setAddingProductId(null);
    }
  };

  if (isLoading) return <p role="status" className="py-12 text-sm text-gray-500">Finding your next favorite...</p>;

  if (products.length === 0) {
    return (
      <div className="border-y border-gray-200 py-14 text-left">
        <h3 className="text-xl font-black text-gray-950">Nothing here just yet.</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">Try another search or choose a different category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 xl:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="group flex min-w-0 flex-col text-left">
          <Link to={`/products/${product.id}`} className="block">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {product.isOutOfStock && (
                <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-bold uppercase text-gray-700">
                  Sold out
                </span>
              )}
            </div>
          </Link>

          <div className="flex flex-1 flex-col pt-3">
            <p className="text-[10px] font-bold uppercase text-indigo-600">{product.category}</p>
            <Link to={`/products/${product.id}`} className="mt-1 block text-gray-950 hover:text-gray-600">
              <h3 className="line-clamp-2 text-sm font-bold leading-5 sm:text-base">{product.name}</h3>
            </Link>
            <p className="mt-1 text-sm font-semibold tabular-nums text-gray-900">{product.formattedPrice}</p>
            <Button
              type="button"
              size="sm"
              disabled={product.isOutOfStock || !onAddToCart || addingProductId !== null}
              isLoading={addingProductId === product.id}
              onClick={() => void handleAddToCart(product.id)}
              className="mt-auto w-full rounded-md py-2.5 sm:mt-4"
            >
              {product.isOutOfStock ? 'Sold out' : 'Add to cart'}
            </Button>
            {feedback?.productId === product.id && (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {feedback.message}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};