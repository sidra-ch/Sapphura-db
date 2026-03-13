"use client";
import React, { useEffect, useState } from 'react';
import ProductSkeleton from './ProductSkeleton';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface SearchResultsDropdownProps {
  query: string;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ query }) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.products || []);
        setLoading(false);
      });
  }, [query]);

  if (!query || !results.length) return null;

  return (
    <div className="absolute w-full bg-[#081220] p-4 rounded-lg border border-gold mt-2 z-10">
      {loading ? (
        <ProductSkeleton />
      ) : (
        <ul>
          {results.map((product) => (
            <li key={product.id} className="flex items-center gap-4 py-2 border-b border-gold last:border-none">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded object-cover"
                loading="lazy"
              />
              <div>
                <div className="font-bold text-gold">{product.name}</div>
                <div className="text-sm text-white">{product.category}</div>
                <div className="text-sm text-gold">${product.price}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsDropdown;
