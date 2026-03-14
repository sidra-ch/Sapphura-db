"use client";
import React, { Suspense, useState } from 'react';
import SearchResultsDropdown from './SearchResultsDropdown';
import ProductSkeleton from '../product/ProductSkeleton';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowDropdown(e.target.value.length > 1);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search products, categories, tags..."
        className="w-full px-4 py-3 rounded-lg border border-gold bg-[#081220] text-white focus:outline-none focus:border-gold"
        autoComplete="off"
        aria-label="Search products"
      />
      {showDropdown && (
        <Suspense fallback={<div className="absolute w-full bg-[#081220] p-4 rounded-lg border border-gold mt-2 z-10"><ProductSkeleton /></div>}>
          <SearchResultsDropdown query={query} />
        </Suspense>
      )}
    </div>
  );
};

export default SearchBar;
