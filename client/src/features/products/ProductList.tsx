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

  const handleAddToCart = async (productId: number) => {
    if (!onAddToCart) return;

    setAddingProductId(productId);
    try {
      await onAddToCart(productId);
    } finally {
      setAddingProductId(null);
    }
  };

  if (isLoading) return <p className="animate-pulse text-gray-400">Loading catalog matrix...</p>;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-left flex flex-col justify-between">
          <Link to={`/products/${product.id}`} className="flex-1">
            <div>
              <div className="aspect-auto w-full rounded-xl bg-gray-50 mb-4 overflow-hidden">
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              </div>

              <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
              
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            </div>
          </Link>

          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xl font-extrabold text-gray-900">{product.formattedPrice}</span>

            <Button
              type="button"
              size="sm"
              disabled={product.isOutOfStock || !onAddToCart || addingProductId !== null}
              isLoading={addingProductId === product.id}
              onClick={() => void handleAddToCart(product.id)}
            >
              Add to Cart
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
};