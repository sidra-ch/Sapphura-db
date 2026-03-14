"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../components/cart/CartContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
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
          <ShoppingBag className="w-24 h-24 text-gold/30 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gold mb-4">Your Cart is Empty</h1>
          <p className="text-white/60 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-8">Shopping Cart ({totalItems})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#1a1a40] border border-gold/20 rounded-xl p-4 flex gap-4">
                <Link href={`/product/${item.id}`}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/product/${item.id}`} className="text-gold font-bold text-lg hover:text-yellow-400 transition">
                        {item.name}
                      </Link>
                      {item.variant && (
                        <p className="text-white/60 text-sm">Variant: {item.variant}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-[#0a0a23] rounded-lg flex items-center justify-center text-white hover:bg-gold/20 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-[#0a0a23] rounded-lg flex items-center justify-center text-white hover:bg-gold/20 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-white font-bold text-xl">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-gold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-white/80">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between text-white/80">
                <span>Tax</span>
                <span>${(totalPrice * 0.15).toFixed(2)}</span>
              </div>
              <div className="border-t border-gold/20 pt-3 flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span className="text-gold">${(totalPrice * 1.15).toFixed(2)}</span>
              </div>
            </div>
            <Link 
              href="/checkout"
              className="block w-full bg-gold text-[#0a0a23] text-center py-4 rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              Proceed to Checkout
            </Link>
            <button 
              onClick={clearCart}
              className="block w-full text-red-400 text-center py-3 mt-3 hover:text-red-300 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
