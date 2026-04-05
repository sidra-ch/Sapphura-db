"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '../../lib/currency';

interface SearchResult {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

const demoProducts: SearchResult[] = [
  { id: '1', name: 'Gold Crescent Necklace', image: '/neckles-1.jpeg', price: 299, category: 'Jewelry' },
  { id: '2', name: 'Navy Velvet Abaya', image: '/suit-31.jpeg', price: 189, category: 'Clothing' },
  { id: '3', name: 'Diamond Bracelet', image: '/bracelet-1.jpeg', price: 399, category: 'Jewelry' },
  { id: '4', name: 'Kashmiri Bangals', image: '/bangals-1.jpeg', price: 249, category: 'Jewelry' },
  { id: '5', name: 'Elegant Earrings', image: '/earing-1.jpeg', price: 149, category: 'Jewelry' },
  { id: '6', name: 'Summer Suit', image: '/summer-1.jpeg', price: 199, category: 'Clothing' },
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filtered = demoProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleResultClick = (id: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${id}`);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-64 pl-10 pr-4 py-2 bg-[#0B1A2F] border border-gold/30 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-gold"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
        {query && (
          <button 
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-gold"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 left-0 right-0 bg-[#0B1A2F] border border-gold rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50"
        >
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => handleResultClick(product.id)}
              className="flex items-center gap-4 p-3 hover:bg-gold/10 cursor-pointer transition border-b border-gold/10 last:border-0"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-12 h-12 object-cover rounded-lg border border-gold"
              />
              <div className="flex-1">
                <div className="text-gold font-medium text-sm">{product.name}</div>
                <div className="text-white/50 text-xs">{product.category}</div>
              </div>
              <div className="text-white font-bold">{formatCurrency(product.price, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </div>
          ))}
          <div className="p-3 border-t border-gold/20">
            <Link 
              href={`/search?q=${query}`}
              onClick={() => setIsOpen(false)}
              className="text-gold hover:text-yellow-300 text-sm font-medium"
            >
              View all results →
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}