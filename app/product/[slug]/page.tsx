"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCart } from '../../../components/cart/CartContext';
import { useWishlist } from '../../../components/wishlist/WishlistContext';
import { FALLBACK_PRODUCT_IMAGE, getPrimaryImageFromList, isVideoUrl } from '../../../lib/media';

const FALLBACK_IMAGE = FALLBACK_PRODUCT_IMAGE;

type Product = {
  id: string;
  legacyId?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  inStock: boolean;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  image?: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const routeValue = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const wishlistKey = product?.slug || product?.id || '';

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!routeValue) {
        if (isMounted) {
          setProduct(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/products?slug=${encodeURIComponent(routeValue)}`, { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load product');
        }

        const nextProduct = Array.isArray(data.products) ? data.products[0] ?? null : null;
        if (!isMounted) return;

        setProduct(nextProduct);
        setSelectedImage(0);
      } catch {
        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [routeValue]);

  const productMedia = product?.images?.length ? product.images : [FALLBACK_IMAGE];
  const selectedMedia = productMedia[selectedImage] || FALLBACK_IMAGE;
  const selectedMediaIsVideo = isVideoUrl(selectedMedia);
  const productPreviewImage = product?.image || getPrimaryImageFromList(productMedia);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.slug,
        slug: product.slug,
        name: product.name,
        image: productPreviewImage,
        price: product.price,
        quantity
      });
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(wishlistKey)) {
        removeFromWishlist(wishlistKey);
      } else {
        addToWishlist({
          id: wishlistKey,
          slug: product.slug,
          name: product.name,
          image: productPreviewImage,
          price: product.price
        });
      }
    }
  };

  if (!product && !isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a23] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gold mb-4">Product Not Found</h1>
          <Link href="/collections" className="text-white/70 hover:text-gold">Go back to collections</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-40 bg-[#1a1a40] rounded mb-6">
            <Skeleton height={32} width={160} baseColor="#0a0a23" highlightColor="#1a1a40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton height={500} baseColor="#0a0a23" highlightColor="#1a1a40" className="rounded-2xl" />
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} height={80} width={80} baseColor="#0a0a23" highlightColor="#1a1a40" className="rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton height={20} width={100} baseColor="#0a0a23" highlightColor="#1a1a40" />
              <Skeleton height={48} width="80%" baseColor="#0a0a23" highlightColor="#1a1a40" />
              <Skeleton height={40} width={120} baseColor="#0a0a23" highlightColor="#1a1a40" />
              <Skeleton height={100} width="100%" baseColor="#0a0a23" highlightColor="#1a1a40" />
              <Skeleton height={56} width={200} baseColor="#0a0a23" highlightColor="#1a1a40" className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % productMedia.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + productMedia.length) % productMedia.length);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/collections" className="inline-flex items-center text-gold hover:text-yellow-300 mb-6 transition">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold shadow-xl">
              {selectedMediaIsVideo ? (
                <video
                  key={selectedMedia}
                  src={selectedMedia}
                  className="w-full h-[500px] object-cover bg-black"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img 
                  src={selectedMedia}
                  alt={product.name}
                  className="w-full h-[500px] object-cover"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              )}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white p-2 rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold text-white p-2 rounded-full transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              {productMedia.map((mediaUrl, idx) => {
                const mediaIsVideo = isVideoUrl(mediaUrl);
                return (
                <button
                  key={`${mediaUrl}-${idx}`}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-gold' : 'border-transparent opacity-60'
                  }`}
                >
                  {mediaIsVideo ? (
                    <div className="relative w-full h-full bg-black">
                      <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">Video</span>
                    </div>
                  ) : (
                    <img
                      src={mediaUrl}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  )}
                </button>
              );})}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <span className="text-gold/70 text-sm">{product.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gold mt-2">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-white/30'}`} 
                  />
                ))}
              </div>
              <span className="text-white/60">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gold">${product.price}</span>
              <span className="text-xl text-white/40 line-through">${Math.floor(product.price * 1.3)}</span>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">30% OFF</span>
            </div>

            <p className="text-white/80 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={product.inStock ? 'text-green-400' : 'text-red-400'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gold rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gold hover:bg-gold/20 transition"
                >
                  -
                </button>
                <span className="px-4 py-2 text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gold hover:bg-gold/20 transition"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gold text-[#0a0a23] py-3 px-6 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                onClick={handleWishlist}
                className={`p-3 border rounded-lg transition ${
                  isInWishlist(wishlistKey) 
                    ? 'border-red-500 bg-red-500 text-white' 
                    : 'border-gold text-gold hover:bg-gold hover:text-[#0a0a23]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(wishlistKey) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="border-t border-gold/30 pt-6 mt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  Free Shipping
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  7-Day Returns
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  Authenticity Guaranteed
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span className="w-2 h-2 bg-gold rounded-full"></span>
                  24/7 Support
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
