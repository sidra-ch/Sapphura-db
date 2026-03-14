"use client";

import React, { useState } from 'react';
import SearchResultsDropdown from './SearchResultsDropdown';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setLoading(true);
    const res = await fetch(`/api/search?q=${e.target.value}`);
    const data = await res.json();
    setResults(data.products);
    setLoading(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search products..."
        className="w-full p-2 border rounded"
      />
      <SearchResultsDropdown results={results} loading={loading} />
    </div>
  );
};

export default SearchBar;
