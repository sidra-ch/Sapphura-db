"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, X, ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCart } from '../../components/cart/CartContext';
import { useWishlist } from '../../components/wishlist/WishlistContext';

const allProducts = [
  { id: 'gold-crescent-necklace', name: 'Gold Crescent Necklace', price: 299, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop', category: 'Necklaces', rating: 5, collection: 'bridal' },
  { id: 'navy-velvet-abaya', name: 'Navy Velvet Abaya', price: 189, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', category: 'Abayas', rating: 4, collection: 'eid' },
  { id: 'diamond-bracelet', name: 'Diamond Bracelet', price: 399, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', category: 'Bracelets', rating: 5, collection: 'bridal' },
  { id: 'kashmiri-bangals', name: 'Kashmiri Bangals', price: 249, image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop', category: 'Bangles', rating: 4, collection: 'bridal' },
  { id: 'elegant-earrings', name: 'Elegant Earrings', price: 149, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop', category: 'Earrings', rating: 5, collection: 'party' },
  { id: 'summer-suit', name: 'Summer Suit', price: 199, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', category: 'Suits', rating: 4, collection: 'summer' },
  { id: 'winter-coat', name: 'Winter Collection', price: 299, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', category: 'Suits', rating: 5, collection: 'winter' },
  { id: 'makeup-set', name: 'Makeup Collection', price: 99, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', category: 'Lipstick', rating: 4, collection: 'party' },
  { id: 'bridal-necklace-set', name: 'Bridal Necklace Set', price: 599, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop', category: 'Bridal Sets', rating: 5, collection: 'bridal' },
  { id: 'royal-abaya', name: 'Royal Embroidered Abaya', price: 249, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop', category: 'Abayas', rating: 5, collection: 'eid' },
  { id: 'gold-rings', name: 'Gold Ring Set', price: 179, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop', category: 'Rings', rating: 4, collection: 'bridal' },
  { id: 'perfume-bundle', name: 'Luxury Perfume Set', price: 129, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', category: 'Perfumes', rating: 5, collection: 'party' },
];

const categories = ['All', 'Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Bangles', 'Bridal Sets', 'Abayas', 'Suits', 'Dresses', 'Lipstick', 'Perfumes'];
const priceRanges = ['All', 'Under $100', '$100 - $200', '$200 - $300', 'Over $300'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Rating'];

function CollectionsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const collectionParam = searchParams.get('collection');
  const sortParam = searchParams.get('sort');

  const [selectedCategory, setSelectedCategory] = useState(categoryParam ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1) : 'All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState(sortParam ? sortParam.charAt(0).toUpperCase() + sortParam.slice(1) : 'Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (categoryParam) {
      const formatted = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).replace(/-/g, ' ');
      setSelectedCategory(categories.includes(formatted) ? formatted : 'All');
    }
  }, [categoryParam]);

  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (collectionParam && product.collection !== collectionParam) return false;
    if (selectedPriceRange !== 'All') {
      if (selectedPriceRange === 'Under $100' && product.price >= 100) return false;
      if (selectedPriceRange === '$100 - $200' && (product.price < 100 || product.price > 200)) return false;
      if (selectedPriceRange === '$200 - $300' && (product.price < 200 || product.price > 300)) return false;
      if (selectedPriceRange === 'Over $300' && product.price <= 300) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High': return a.price - b.price;
      case 'Price: High to Low': return b.price - a.price;
      case 'Rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">
            {collectionParam ? collectionParam.charAt(0).toUpperCase() + collectionParam.slice(1).replace(/-/g, ' ') + ' Collection' : 'Shop All Products'}
          </h1>
          <p className="text-white/60">{sortedProducts.length} products found</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-[#1a1a40] border border-gold/20 rounded-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-lg hover:bg-gold/20 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-gold text-[#0a0a23]'
                      : 'text-white/70 hover:bg-gold/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[#0a0a23] border border-gold/30 rounded-lg text-white"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 bg-[#0a0a23] rounded-lg p-1">
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
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 p-6 bg-[#1a1a40] border border-gold/20 rounded-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gold font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedCategory === cat
                          ? 'bg-gold text-[#0a0a23]'
                          : 'border border-gold/30 text-white/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Price Range</label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedPriceRange === range
                          ? 'bg-gold text-[#0a0a23]'
                          : 'border border-gold/30 text-white/70'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {sortedProducts.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <p className="text-white/60 text-xl">No products found</p>
            <p className="text-white/40 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden">
                  <Skeleton height={250} baseColor="#0a0a23" highlightColor="#1a1a40" />
                  <div className="p-4">
                    <Skeleton height={16} width="60%" baseColor="#0a0a23" highlightColor="#1a1a40" />
                    <Skeleton height={20} width="80%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mt-2" />
                    <Skeleton height={24} width="30%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mt-2" />
                  </div>
                </div>
              ))
            ) : (
              sortedProducts.map((product, index) => {
                const inWishlist = isInWishlist(product.id);
                return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden hover:border-gold transition group">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] text-xs font-bold px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (inWishlist) {
                              removeFromWishlist(product.id);
                            } else {
                              addToWishlist({ id: product.id, name: product.name, image: product.image, price: product.price });
                            }
                          }}
                          className={`p-2 rounded-full transition ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-gold'}`}
                        >
                          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id: product.id, name: product.name, image: product.image, price: product.price, quantity: 1 });
                          }}
                          className="p-2 rounded-full bg-gold text-[#0a0a23] hover:bg-yellow-400 transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <Link href={`/product/${product.id}`}>
                    <div className="p-4">
                      <h3 className="text-gold font-semibold mb-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">${product.price}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-gold">★</span>
                          <span className="text-white/70 text-sm">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                    </Link>
                  </div>
              </motion.div>
            )})
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1C3F] flex items-center justify-center"><div className="text-gold">Loading...</div></div>}>
      <CollectionsContent />
    </Suspense>
  );
}
