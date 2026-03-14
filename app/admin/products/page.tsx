"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Plus, Edit, Trash2, Eye,
  Grid, List, X, Image, DollarSign
} from 'lucide-react';

const products = [
  { id: '1', name: 'Gold Crescent Necklace', category: 'Necklaces', price: 299, stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop' },
  { id: '2', name: 'Diamond Bracelet', category: 'Bracelets', price: 399, stock: 38, status: 'Active', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&h=200&fit=crop' },
  { id: '3', name: 'Bridal Necklace Set', category: 'Bridal Sets', price: 599, stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop' },
  { id: '4', name: 'Royal Embroidered Abaya', category: 'Abayas', price: 249, stock: 32, status: 'Active', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&h=200&fit=crop' },
  { id: '5', name: 'Kashmiri Bangals', category: 'Bangles', price: 249, stock: 50, status: 'Active', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop' },
  { id: '6', name: 'Elegant Earrings', category: 'Earrings', price: 149, stock: 60, status: 'Active', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&h=200&fit=crop' },
  { id: '7', name: 'Gold Ring Set', category: 'Rings', price: 179, stock: 28, status: 'Active', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop' },
  { id: '8', name: 'Luxury Perfume Set', category: 'Perfumes', price: 129, stock: 42, status: 'Active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop' },
  { id: '9', name: 'Navy Velvet Abaya', category: 'Abayas', price: 189, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
  { id: '10', name: 'Summer Suit Set', category: 'Suits', price: 199, stock: 35, status: 'Active', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop' },
];

const categories = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles', 'Bridal Sets', 'Abayas', 'Suits', 'Perfumes'];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0a0a23]">
      <div className="p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="p-2 bg-[#1a1a40] rounded-lg text-gold hover:bg-gold/20 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Products</h1>
              <p className="text-white/50">Manage your product catalog</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-[#0a0a23] rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a40] border border-gold/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  categoryFilter === cat
                    ? 'bg-gold text-[#0a0a23]'
                    : 'bg-[#1a1a40] text-white/70 hover:bg-gold/20 hover:text-gold border border-gold/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-[#1a1a40] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gold text-[#0a0a23]' : 'text-white/70'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gold text-[#0a0a23]' : 'text-white/70'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden group hover:border-gold transition"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button className="p-2 bg-gold text-[#0a0a23] rounded-full hover:scale-110 transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white text-[#0a0a23] rounded-full hover:scale-110 transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                    product.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-white/50 text-xs">{product.category}</p>
                  <h3 className="text-gold font-semibold text-sm truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white font-bold">${product.price}</span>
                    <span className={`text-xs ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a40] border border-gold/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gold">Add New Product</h2>
                  <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Product Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" placeholder="Enter product name" />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Category</label>
                      <select className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold">
                        {categories.slice(1).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input type="number" className="w-full pl-10 pr-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2">Stock Quantity</label>
                      <input type="number" className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold" placeholder="0" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Description</label>
                    <textarea rows={4} className="w-full px-4 py-3 bg-[#0a0a23] border border-gold/20 rounded-lg text-white focus:outline-none focus:border-gold resize-none" placeholder="Product description..."></textarea>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-gold/30 rounded-lg p-8 text-center">
                      <Image className="w-12 h-12 text-white/30 mx-auto mb-2" />
                      <p className="text-white/50">Drag and drop images or click to browse</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gold/30 text-white rounded-lg hover:bg-gold/10 transition">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 py-3 bg-gold text-[#0a0a23] rounded-lg font-bold hover:bg-yellow-400 transition">
                      Add Product
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
