"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from './CartContext';
import Link from 'next/link';
import { formatCurrency } from '../../lib/currency';

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, totalPrice, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  const removeItem = (id: string) => removeFromCart(id);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          className="w-full max-w-md h-full bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] border-l-2 border-gold shadow-2xl flex flex-col"
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold/30">
            <h2 className="text-2xl font-bold text-gold flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              Your Cart
            </h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/70 hover:text-gold transition p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center mt-16">
                <ShoppingBag className="w-16 h-16 text-gold/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg">Your cart is empty</p>
                <Link 
                  href="/collections"
                  onClick={() => setIsOpen(false)}
                  className="text-gold hover:text-yellow-300 mt-4 inline-block"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <motion.div 
                    key={`${item.id}-${item.variant}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 bg-[#0B1A2F]/50 rounded-xl p-4 border border-gold/20"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg border border-gold"
                    />
                    <div className="flex-1">
                      <div className="text-gold font-semibold text-sm">{item.name}</div>
                      {item.variant && (
                        <div className="text-white/50 text-xs">Variant: {item.variant}</div>
                      )}
                      <div className="text-white font-bold mt-1">{formatCurrency(item.price)}</div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center hover:bg-gold hover:text-[#0a0a23] transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center hover:bg-gold hover:text-[#0a0a23] transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-400 hover:text-red-300 transition p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gold/30 bg-[#0B1A2F]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Subtotal</span>
                <span className="text-2xl font-bold text-gold">{formatCurrency(totalPrice)}</span>
              </div>
              <p className="text-white/50 text-sm mb-4">Shipping & taxes calculated at checkout</p>
              
              <Link 
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gold text-[#0a0a23] font-bold hover:bg-yellow-400 transition mb-3"
              >
                Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="block text-center text-gold hover:text-yellow-300 text-sm"
              >
                View Cart Details
              </Link>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}