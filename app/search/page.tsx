"use client";

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import SearchResultsDropdown from '../../components/search/SearchResultsDropdown';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-8 text-center">Search Products</h1>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(e.target.value.length > 1);
            }}
            placeholder="Search for jewelry, clothing, makeup..."
            className="w-full px-6 py-4 rounded-xl border border-gold bg-[#1a1a40] text-white text-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gold text-[#0a0a23] px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {showResults && query && (
          <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-gold font-bold text-xl">Search Results for &quot;{query}&quot;</h2>
              <button onClick={() => { setQuery(''); setShowResults(false); }} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Suspense fallback={<div className="text-white/60">Loading results...</div>}>
              <SearchResultsDropdown query={query} />
            </Suspense>
          </div>
        )}

        {!showResults && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg mb-4">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Necklaces', 'Earrings', 'Abayas', 'Makeup', 'Bracelets', 'Suits'].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${term.toLowerCase()}`}
                  className="px-4 py-2 bg-gold/10 text-gold rounded-full hover:bg-gold/20 transition"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1C3F] flex items-center justify-center"><div className="text-gold">Loading...</div></div>}>
      <SearchContent />
    </Suspense>
  );
}
