"use client";
import React from "react";
import FiltersSidebar from '../../components/FiltersSidebar';
import { ShoppingBag } from "lucide-react";
import InfiniteProductGrid from '../../components/InfiniteProductGrid';

const mockProducts = Array.from({ length: 12 }, (_, idx) => ({
  id: idx + 1,
  name: `Luxury Product ${idx + 1}`,
}));

export default function CollectionsPage() {
  const [products, setProducts] = React.useState(mockProducts);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchMore = () => {
    // Simulate API call
    setTimeout(() => {
      if (products.length >= 36) {
        setHasMore(false);
        return;
      }
      const nextProducts = Array.from({ length: 12 }, (_, idx) => ({
        id: products.length + idx + 1,
        name: `Luxury Product ${products.length + idx + 1}`,
      }));
      setProducts([...products, ...nextProducts]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a23] py-16 px-4 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
          {/* Advanced Filters Sidebar */}
          <FiltersSidebar />
        </div>
        <div className="col-span-3">
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-10 flex items-center gap-4">
            <ShoppingBag className="w-8 h-8 text-gold" /> Collections
          </h1>
          <div className="text-white/80 text-lg mb-8">
            Explore our luxury collections for Ramadan, Abaya, Jewelry, and more.
          </div>
          <InfiniteProductGrid products={products} fetchMore={fetchMore} hasMore={hasMore} />
        </div>
      </div>
    </main>
  );
}