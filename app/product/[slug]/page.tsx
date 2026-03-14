"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useCart } from '../../../components/cart/CartContext';
import { useWishlist } from '../../../components/wishlist/WishlistContext';

const products: Record<string, {
  id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}> = {
  'gold-crescent-necklace': {
    id: 'gold-crescent-necklace',
    name: 'Gold Crescent Necklace',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'],
    price: 299,
    description: 'Elegant gold necklace featuring a beautiful crescent design. Perfect for special occasions and formal events. Made with premium quality gold and intricate craftsmanship.',
    category: 'Necklaces',
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  'navy-velvet-abaya': {
    id: 'navy-velvet-abaya',
    name: 'Navy Velvet Abaya',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop'],
    price: 189,
    description: 'Luxurious navy velvet abaya with elegant stitching. Perfect for Ramadan and special occasions. Comfortable fabric with premium finish.',
    category: 'Abayas',
    inStock: true,
    rating: 4.6,
    reviews: 89
  },
  'diamond-bracelet': {
    id: 'diamond-bracelet',
    name: 'Diamond Bracelet',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    price: 399,
    description: 'Stunning bracelet with diamond accents. Perfect for weddings and special occasions. High-quality materials with expert craftsmanship.',
    category: 'Bracelets',
    inStock: true,
    rating: 4.9,
    reviews: 67
  },
  'kashmiri-bangals': {
    id: 'kashmiri-bangals',
    name: 'Kashmiri Bangals',
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop'],
    price: 249,
    description: 'Authentic Kashmiri bangles with traditional handcrafted designs. Each piece is unique and made by skilled artisans.',
    category: 'Bangles',
    inStock: true,
    rating: 4.8,
    reviews: 203
  },
  'elegant-earrings': {
    id: 'elegant-earrings',
    name: 'Elegant Earrings',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
    price: 149,
    description: 'Classic gold earrings with intricate traditional designs. A timeless piece that adds elegance to any outfit.',
    category: 'Earrings',
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  'summer-suit': {
    id: 'summer-suit',
    name: 'Summer Suit Set',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop'],
    price: 199,
    description: 'Light and breathable summer suit perfect for hot weather. Available in multiple colors with comfortable fit.',
    category: 'Suits',
    inStock: true,
    rating: 4.5,
    reviews: 91
  },
  'winter-coat': {
    id: 'winter-coat',
    name: 'Winter Collection',
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop'],
    price: 299,
    description: 'Elegant winter collection with premium quality materials. Perfect for the cold season.',
    category: 'Suits',
    inStock: true,
    rating: 4.9,
    reviews: 45
  },
  'makeup-set': {
    id: 'makeup-set',
    name: 'Makeup Collection',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop'],
    price: 99,
    description: 'Professional makeup collection with all essential products. Perfect for every occasion.',
    category: 'Lipstick',
    inStock: true,
    rating: 4.4,
    reviews: 78
  },
  'bridal-necklace-set': {
    id: 'bridal-necklace-set',
    name: 'Bridal Necklace Set',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop'],
    price: 599,
    description: 'Stunning bridal necklace set with intricate designs. Perfect for your special day.',
    category: 'Bridal Sets',
    inStock: true,
    rating: 5.0,
    reviews: 34
  },
  'royal-abaya': {
    id: 'royal-abaya',
    name: 'Royal Embroidered Abaya',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop'],
    price: 249,
    description: 'Royal embroidered abaya with beautiful patterns. Perfect for special occasions.',
    category: 'Abayas',
    inStock: true,
    rating: 4.9,
    reviews: 56
  },
  'gold-rings': {
    id: 'gold-rings',
    name: 'Gold Ring Set',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'],
    price: 179,
    description: 'Elegant gold ring set with traditional designs. A timeless addition to your jewelry collection.',
    category: 'Rings',
    inStock: true,
    rating: 4.7,
    reviews: 89
  },
  'perfume-bundle': {
    id: 'perfume-bundle',
    name: 'Luxury Perfume Set',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop'],
    price: 129,
    description: 'Luxury perfume set with long-lasting fragrances. Perfect for every occasion.',
    category: 'Perfumes',
    inStock: true,
    rating: 4.8,
    reviews: 112
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = products[slug];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity
      });
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          image: product.images[0],
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

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);

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
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
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
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? 'border-gold' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
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
                  isInWishlist(product.id) 
                    ? 'border-red-500 bg-red-500 text-white' 
                    : 'border-gold text-gold hover:bg-gold hover:text-[#0a0a23]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
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
