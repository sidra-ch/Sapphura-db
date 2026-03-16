"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Edit, Trash2 } from 'lucide-react';

type CategoryRow = {
  id: number;
  name: string;
  products: number;
  image: string;
};

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data.categories) || !mounted) return;
        setCategories(data.categories);
      } catch {
        // keep page stable
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Categories</h1>
              <p className="text-white/50">Manage product categories</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            <Plus className="w-5 h-5" /> Add Category
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden group hover:border-gold transition-colors"
            >
              <div className="relative h-32">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-2 bg-gold text-[#0a0a23] rounded-full hover:scale-110 transition-transform"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-gold font-bold text-lg">{category.name}</h3>
                <p className="text-white/50 text-sm">{category.products} products</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
