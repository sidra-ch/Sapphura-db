"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Plus, Edit, Trash2 } from 'lucide-react';

const categories = [
  { id: 1, name: 'Necklaces', products: 45, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop' },
  { id: 2, name: 'Earrings', products: 38, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop' },
  { id: 3, name: 'Rings', products: 28, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop' },
  { id: 4, name: 'Bracelets', products: 32, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop' },
  { id: 5, name: 'Bangles', products: 50, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop' },
  { id: 6, name: 'Bridal Sets', products: 25, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop' },
  { id: 7, name: 'Abayas', products: 42, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=200&fit=crop' },
  { id: 8, name: 'Suits', products: 35, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
