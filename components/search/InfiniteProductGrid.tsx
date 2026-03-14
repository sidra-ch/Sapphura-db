import React, { Suspense } from 'react';
import ProductSkeleton from '../product/ProductSkeleton';

interface InfiniteProductGridProps {
  products: any[];
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
          {/* Replace with actual ProductCard component */}
          <div>{product.name}</div>
        </Suspense>
      ))}
      <div id="infinite-sentinel" className="h-1 w-full" />
      {hasMore && <ProductSkeleton />}
    </div>
  );
};

export default InfiniteProductGrid;
