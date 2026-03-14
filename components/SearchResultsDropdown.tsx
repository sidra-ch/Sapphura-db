import React from 'react';

interface SearchResultsDropdownProps {
  results: any[];
  loading: boolean;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ results, loading }) => {
  if (loading) return <div className="absolute w-full bg-white shadow p-2">Loading...</div>;
  if (!results.length) return null;

  return (
    <div className="absolute w-full bg-white shadow p-2">
      {results.map((product) => (
        <div key={product.id} className="p-2 border-b last:border-b-0">
          {product.name}
        </div>
      ))}
    </div>
  );
};

export default SearchResultsDropdown;
