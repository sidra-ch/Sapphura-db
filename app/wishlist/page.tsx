"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../components/wishlist/WishlistContext';
import { useCart } from '../../components/cart/CartContext';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#0B1C3F] flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center">
        <div className="text-center p-8">
          <Heart className="w-24 h-24 text-gold/30 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gold mb-4">Your Wishlist is Empty</h1>
          <p className="text-white/60 mb-8">Save items you love by clicking the heart icon.</p>
          <Link 
            href="/collections" 
            className="inline-flex items-center gap-2 bg-gold text-[#0a0a23] px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: { id: string; name: string; image: string; price: number }) => {
    addToCart({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1
    });
    removeFromWishlist(item.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-8">My Wishlist ({items.length})</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden">
              <Link href={`/product/${item.id}`}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.id}`} className="text-gold font-bold hover:text-yellow-400 transition">
                  {item.name}
                </Link>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-white font-bold text-xl">${item.price}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="p-2 bg-gold text-[#0a0a23] rounded-lg hover:bg-yellow-500 transition"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/collections" 
            className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 transition"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
