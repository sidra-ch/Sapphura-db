import React, { Suspense } from 'react';
import Link from 'next/link';
import { formatCurrency } from '../../lib/currency';
import { FALLBACK_PRODUCT_IMAGE } from '../../lib/media';
import ProductSkeleton from '../product/ProductSkeleton';

interface InfiniteProductGridProps {
  products: Array<{
    id?: string | number;
    slug?: string;
    name: string;
    category?: string;
    price?: number;
    image?: string;
  }>;
  fetchMore: () => void;
  hasMore: boolean;
}

const InfiniteProductGrid: React.FC<InfiniteProductGridProps> = ({ products, fetchMore, hasMore }) => {
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });
    const sentinel = document.getElementById('infinite-sentinel');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, fetchMore]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {products.map((product, idx) => (
        <Suspense key={product.id || idx} fallback={<ProductSkeleton />}>
          <Link
            href={`/product/${product.slug || product.id || ''}`}
            className="block rounded-xl overflow-hidden border border-gold/20 bg-[#1a1a40] hover:border-gold transition"
          >
            <img
              src={product.image || FALLBACK_PRODUCT_IMAGE}
              alt={product.name}
              className="w-full h-48 object-cover"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
            <div className="p-3">
              <h3 className="text-gold font-semibold line-clamp-1">{product.name}</h3>
              <p className="text-white/60 text-xs mt-1 line-clamp-1">{product.category || 'Product'}</p>
              {typeof product.price === 'number' && (
                <p className="text-white font-bold mt-2">{formatCurrency(product.price, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              )}
            </div>
          </Link>
        </Suspense>
      ))}
      <div id="infinite-sentinel" className="h-1 w-full" />
      {hasMore && <ProductSkeleton />}
    </div>
  );
};

export default InfiniteProductGrid;
