"use client";

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, X, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCart } from '../../components/cart/CartContext';
import { useWishlist } from '../../components/wishlist/WishlistContext';
import { PRODUCT_CATALOG } from '../../lib/products-catalog';
import { FALLBACK_PRODUCT_IMAGE } from '../../lib/media';

const products = PRODUCT_CATALOG;
const FALLBACK_IMAGE = FALLBACK_PRODUCT_IMAGE;

const categories = ['All', 'Jewelry', 'Abaya', 'Accessories', 'Clothing', 'Makeup'];
const priceRanges = ['All', 'Under $100', '$100 - $200', '$200 - $300', 'Over $300'];
const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low'];

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  categoryId: number;
}

function CollectionsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') || '';
  const collectionParam = searchParams?.get('collection') || '';

  const normalizeCategoryParam = (raw: string) => {
    const value = raw.toLowerCase().trim();
    const aliasToCategory: Record<string, string> = {
      all: 'All',
      jewelry: 'Jewelry',
      necklace: 'Jewelry',
      necklaces: 'Jewelry',
      'necklace-sets': 'Jewelry',
      earring: 'Jewelry',
      earrings: 'Jewelry',
      ring: 'Jewelry',
      rings: 'Jewelry',
      bracelet: 'Jewelry',
      bracelets: 'Jewelry',
      bangle: 'Jewelry',
      bangles: 'Jewelry',
      bridal: 'Jewelry',
      abaya: 'Abaya',
      abayas: 'Abaya',
      accessories: 'Accessories',
      accessory: 'Accessories',
      clothing: 'Clothing',
      clothes: 'Clothing',
      suit: 'Clothing',
      suits: 'Clothing',
      summer: 'Clothing',
      winter: 'Clothing',
      makeup: 'Makeup',
      beauty: 'Makeup',
    };

    return aliasToCategory[value] || 'All';
  };
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading] = useState(false);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!galleryProduct) return;
      if (event.key === 'Escape') {
        setGalleryProduct(null);
        return;
      }
      if (event.key === 'ArrowRight') {
        setGalleryImageIndex((prev) => (prev + 1) % galleryProduct.images.length);
      }
      if (event.key === 'ArrowLeft') {
        setGalleryImageIndex((prev) => (prev - 1 + galleryProduct.images.length) % galleryProduct.images.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [galleryProduct]);

  const normalizeCatalogImage = (imageUrl: string | undefined) => {
    if (!imageUrl) return FALLBACK_IMAGE;

    const normalized = imageUrl.trim();
    if (!normalized.startsWith('http')) return FALLBACK_IMAGE;

    // Older generated pools contain versioned URLs that now 404.
    if (normalized.includes('/v177356') || normalized.includes('/v177300')) {
      return FALLBACK_IMAGE;
    }

    return normalized;
  };

  const getProductImage = (images: string[]) => {
    if (!images || !images.length) return normalizeCatalogImage(undefined);
    return normalizeCatalogImage(images[0]);
  };

  const getCategoryName = (categoryId: number) => {
    const catNames: Record<number, string> = { 1: 'Jewelry', 2: 'Abaya', 3: 'Accessories', 4: 'Clothing', 5: 'Makeup' };
    return catNames[categoryId] || 'Other';
  };

  const openGallery = (product: Product, imageIndex = 0) => {
    setGalleryProduct(product);
    setGalleryImageIndex(imageIndex);
  };

  const closeGallery = () => {
    setGalleryProduct(null);
    setGalleryImageIndex(0);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Reset collection-level filtering when user chooses All categories.
    if (category === 'All') {
      setSelectedCollection('all');
    }
  };

  const matchesCollection = (product: Product, collectionKey: string) => {
    const collectionSlugMap: Record<string, string[]> = {
      suits: ['navy-velvet-abaya', 'silk-abaya-set', 'royal-abaya', 'summer-suit', 'party-wear-saree'],
      bangles: ['kashmiri-bangals'],
      necklaces: ['gold-crescent-necklace', 'bridal-necklace-set'],
      earrings: ['pearl-earrings', 'diamond-stud-earrings'],
      bracelets: ['diamond-bracelet', 'crystal-hair-band', 'gold-ring-set'],
      summer: ['summer-suit'],
      winter: ['winter-collection', 'kashmiri-shawl'],
      makeup: ['luxury-perfume'],
    };

    if (collectionSlugMap[collectionKey]) {
      return collectionSlugMap[collectionKey].includes(product.slug);
    }

    const name = product.name.toLowerCase();
    const slug = product.slug.toLowerCase();

    switch (collectionKey) {
      case 'suits':
        return name.includes('suit') || name.includes('abaya') || slug.includes('suit') || slug.includes('abaya');
      case 'bangles':
        return name.includes('bangle') || name.includes('bangal') || slug.includes('bangle') || slug.includes('bangal');
      case 'necklaces':
        return name.includes('necklace') || slug.includes('necklace');
      case 'earrings':
        return name.includes('earring') || slug.includes('earring');
      case 'bracelets':
        return name.includes('bracelet') || slug.includes('bracelet') || name.includes('hair band') || slug.includes('hair-band');
      case 'summer':
        return name.includes('summer') || slug.includes('summer');
      case 'winter':
        return name.includes('winter') || slug.includes('winter') || name.includes('shawl') || slug.includes('shawl');
      case 'makeup':
        return name.includes('perfume') || name.includes('makeup') || slug.includes('perfume') || slug.includes('makeup');
      default:
        return true;
    }
  };

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(normalizeCategoryParam(categoryParam));
    } else {
      setSelectedCategory('All');
    }

    if (collectionParam) {
      setSelectedCollection(collectionParam.toLowerCase());
    } else {
      setSelectedCollection('all');
    }
  }, [categoryParam, collectionParam]);

  const filteredProducts = products.filter(product => {
    const categoryName = getCategoryName(product.categoryId);
    // When a collection is selected from Featured Collections, prioritize collection matching.
    // This avoids category/collection conflicts that can hide all products.
    if (selectedCollection === 'all' && selectedCategory !== 'All' && categoryName !== selectedCategory) return false;
    if (selectedCollection !== 'all' && !matchesCollection(product, selectedCollection)) return false;
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

            {selectedCollection !== 'all' && (
              <button
                onClick={() => {
                  setSelectedCollection('all');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-lg border border-gold/40 text-gold hover:bg-gold hover:text-[#0a0a23] transition"
              >
                All Collections
              </button>
            )}
            
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
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
                      onClick={() => handleCategorySelect(cat)}
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
                  <Skeleton height={190} baseColor="#0a0a23" highlightColor="#1a1a40" />
                  <div className="p-4">
                    <Skeleton height={16} width="60%" baseColor="#0a0a23" highlightColor="#1a1a40" />
                    <Skeleton height={20} width="80%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mt-2" />
                    <Skeleton height={24} width="30%" baseColor="#0a0a23" highlightColor="#1a1a40" className="mt-2" />
                  </div>
                </div>
              ))
            ) : (
              sortedProducts.map((product, index) => {
                const productKey = product.slug || product.id;
                const inWishlist = isInWishlist(productKey);
                const productImage = getProductImage(product.images);
                const categoryName = getCategoryName(product.categoryId);
                return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden hover:border-gold transition group h-full flex flex-col">
                    <div className="relative">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-44 object-cover group-hover:scale-110 transition duration-300"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-3 py-2">
                        <h3 className="text-white text-sm font-semibold line-clamp-1">{product.name}</h3>
                        <p className="text-white/80 text-[11px] line-clamp-1">{categoryName}</p>
                      </div>
                      <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] text-xs font-bold px-2 py-1 rounded">
                        {categoryName}
                      </span>
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (inWishlist) {
                              removeFromWishlist(productKey);
                            } else {
                              addToWishlist({ id: productKey, slug: product.slug, name: product.name, image: productImage, price: product.price });
                            }
                          }}
                          className={`p-2 rounded-full transition ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-gold'}`}
                        >
                          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({ id: productKey, slug: product.slug, name: product.name, image: productImage, price: product.price, quantity: 1 });
                          }}
                          className="p-2 rounded-full bg-gold text-[#0a0a23] hover:bg-yellow-400 transition"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <Link href={`/product/${product.slug}`} prefetch>
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="text-white font-bold text-lg">${product.price}</span>
                        <span className="text-[11px] px-2.5 py-1.5 rounded-md border border-gold text-gold">View Details</span>
                      </div>
                    </div>
                    </Link>
                  </div>
              </motion.div>
            )})
            )}
          </div>
        )}

        {galleryProduct && (
          (() => {
            const galleryImages = galleryProduct.images.length ? galleryProduct.images : [FALLBACK_IMAGE];
            const activeImage = galleryImages[galleryImageIndex] || FALLBACK_IMAGE;
            return (
          <div
            className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeGallery}
          >
            <div
              className="w-full max-w-5xl bg-[#0f1630] border border-gold/40 rounded-2xl p-4 md:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gold text-xl md:text-2xl font-bold">{galleryProduct.name}</h3>
                  <p className="text-white/60 text-sm">{galleryImageIndex + 1} / {galleryImages.length}</p>
                </div>
                <button
                  onClick={closeGallery}
                  className="p-2 rounded-lg border border-gold/40 text-gold hover:bg-gold hover:text-[#0a0a23] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-gold/30">
                <img
                  src={activeImage}
                  alt={`${galleryProduct.name} large view`}
                  className="w-full h-[55vh] object-cover"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <button
                  onClick={() => setGalleryImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-gold hover:text-[#0a0a23] transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setGalleryImageIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-gold hover:text-[#0a0a23] transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${galleryProduct.slug}-gallery-${idx}`}
                    onClick={() => setGalleryImageIndex(idx)}
                    className={`rounded-md border-2 flex-shrink-0 ${galleryImageIndex === idx ? 'border-gold' : 'border-transparent'}`}
                  >
                    <img
                      src={img}
                      alt={`${galleryProduct.name} thumb ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-sm"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
            );
          })()
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
