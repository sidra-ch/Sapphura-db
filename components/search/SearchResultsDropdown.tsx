"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductSkeleton from '../product/ProductSkeleton';
import { FALLBACK_PRODUCT_IMAGE } from '../../lib/media';

interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  category: string;
  image: string;
}

interface SearchResultsDropdownProps {
  query: string;
  className?: string;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ query, className = 'absolute left-0 right-0 mt-2 z-10' }) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Search request failed');
        }
        return res.json();
      })
      .then((data) => {
        setResults(data.products || []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Could not load results. Please try again.');
        setResults([]);
        setLoading(false);
      });

    return () => controller.abort();
  }, [query]);

  if (query.trim().length < 2) return null;

  return (
    <div className={`w-full bg-[#081220] p-4 rounded-lg border border-gold ${className}`}>
      {loading ? (
        <ProductSkeleton />
      ) : error ? (
        <div className="text-sm text-red-300">{error}</div>
      ) : !results.length ? (
        <div className="text-sm text-white/70">No products found for "{query}".</div>
      ) : (
        <ul>
          {results.map((product) => (
            <li key={product.id} className="border-b border-gold last:border-none">
              <Link href={`/product/${product.slug || product.id}`} className="flex items-center gap-4 py-2">
                <img
                  src={product.image || FALLBACK_PRODUCT_IMAGE}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                  }}
                />
                <div>
                  <div className="font-bold text-gold">{product.name}</div>
                  <div className="text-sm text-white">{product.category}</div>
                  <div className="text-sm text-gold">${product.price}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsDropdown;
