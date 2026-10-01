import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { ProductModel } from '../../types/product';

export const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadFeaturedProducts = async () => {
      try {
        const featuredProducts = await productApi.getFeatured();
        if (isActive) setProducts(featuredProducts);
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : 'Failed to load featured products.');
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadFeaturedProducts();

    return () => {
      isActive = false;
    };
  }, []);

  if (!isLoading && !error && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="featured-products-heading">
      <div className="mb-6 flex items-end justify-between gap-4 text-left">
        <div>
          <h2 id="featured-products-heading" className="mt-2 text-2xl font-extrabold text-gray-900">
            Featured Products
          </h2>
        </div>
        <Link to="/products" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-700 transition-colors hover:text-indigo-600">
          View All <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </p>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading featured products">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="animate-pulse overflow-hidden rounded-md border border-gray-100 bg-white">
              <div className="aspect-square bg-gray-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-100" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
                <div className="h-5 w-1/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group overflow-hidden rounded-md border border-gray-100 bg-white text-left transition-shadow hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-500">
                  {product.description}
                </p>
                <p className="mt-4 text-base font-bold text-gray-900">{product.formattedPrice}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};