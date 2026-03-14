"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const categories = [
  {
    name: 'Jewelry',
    subcategories: ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles', 'Bridal Sets']
  },
  {
    name: 'Clothing',
    subcategories: ['Abayas', 'Suits', 'Dresses', 'Scarves', 'Stitched', 'Unstitched']
  },
  {
    name: 'Makeup',
    subcategories: ['Lipstick', 'Foundation', 'Eyeliner', 'Kohl', 'Perfumes']
  },
  {
    name: 'Accessories',
    subcategories: ['Handbags', 'Watches', 'Belts', 'Hair Accessories']
  }
];

export default function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex gap-6 text-white font-semibold relative z-50">
      <Link href="/" className="hover:text-gold transition py-4">Home</Link>
      
      <div 
        className="relative group"
        onMouseEnter={() => setActiveMenu('collections')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button className="flex items-center gap-1 hover:text-gold transition py-4">
          Collections <ChevronDown className="w-4 h-4" />
        </button>
        
        {activeMenu === 'collections' && (
          <div className="absolute top-full left-0 mt-2 bg-[#0B1A2F] border border-gold rounded-xl shadow-2xl p-6 min-w-[800px] opacity-100 transition-all">
            <div className="grid grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <h3 className="text-gold font-bold mb-3 text-lg">{cat.name}</h3>
                  <ul className="space-y-2">
                    {cat.subcategories.map((sub) => (
                      <li key={sub}>
                        <Link 
                          href={`/collections?category=${sub.toLowerCase().replace(/ /g, '-')}`}
                          className="text-white/70 hover:text-gold transition text-sm"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gold/20 flex gap-4">
              <Link href="/collections" className="text-gold hover:text-yellow-300 text-sm font-semibold">
                View All Collections →
              </Link>
              <Link href="/collections?sort=newest" className="text-white/70 hover:text-gold text-sm">
                New Arrivals
              </Link>
              <Link href="/collections?sort=popular" className="text-white/70 hover:text-gold text-sm">
                Best Sellers
              </Link>
            </div>
          </div>
        )}
      </div>

      <Link href="/collections" className="hover:text-gold transition py-4">Shop</Link>
      <Link href="/about" className="hover:text-gold transition py-4">About</Link>
      <Link href="/contact" className="hover:text-gold transition py-4">Contact</Link>
    </nav>
  );
}