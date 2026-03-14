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
import axios from 'axios';

function cloudinaryUrl(publicId: string) {
  return `https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/${publicId}`;
}

const defaultImage = '/neckles-1.jpeg';

const categories = ['All', 'Jewelry', 'Abaya', 'Accessories', 'Clothing', 'Makeup'];
const priceRanges = ['All', 'Under $100', '$100 - $200', '$200 - $300', 'Over $300'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'];

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string;
  stock: number;
  status: string;
  isFeatured: boolean;
  categoryId: number;
}

function CollectionsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductImage = (imagesStr: string) => {
    try {
      const images = JSON.parse(imagesStr);
      if (images && images.length > 0) {
        const img = images[0].replace('/', '');
        return cloudinaryUrl(img);
      }
    } catch {}
    return defaultImage;
  };

  const getCategoryName = (categoryId: number) => {
    const catNames: Record<number, string> = { 1: 'Jewelry', 2: 'Abaya', 3: 'Accessories', 4: 'Clothing', 5: 'Makeup' };
    return catNames[categoryId] || 'Other';
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).replace(/-/g, ' '));
    }
  }, [categoryParam]);

  const filteredProducts = products.filter(product => {
    const categoryName = getCategoryName(product.categoryId);
    if (selectedCategory !== 'All' && categoryName !== selectedCategory) return false;
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
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gold mb-2">
            Shop All Products
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
                const inWishlist = isInWishlist(String(product.id));
                const productImage = getProductImage(product.images);
                const categoryName = getCategoryName(product.categoryId);
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
                        src={productImage}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] text-xs font-bold px-2 py-1 rounded">
                        {categoryName}
                      </span>
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (inWishlist) {
                              removeFromWishlist(String(product.id));
                            } else {
                              addToWishlist({ id: String(product.id), name: product.name, image: productImage, price: product.price });
                            }
                          }}
                          className={`p-2 rounded-full transition ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-gold'}`}
                        >
                          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id: String(product.id), name: product.name, image: productImage, price: product.price, quantity: 1 });
                          }}
                          className="p-2 rounded-full bg-gold text-[#0a0a23] hover:bg-yellow-400 transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <Link href={`/product/${product.slug}`}>
                    <div className="p-4">
                      <h3 className="text-gold font-semibold mb-1">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">${product.price}</span>
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
