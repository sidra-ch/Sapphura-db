"use client";

import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartButton() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <button 
      onClick={() => setIsOpen(true)}
      className="relative text-gold hover:text-yellow-400 transition"
    >
      <ShoppingBag className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-gold text-[#0a0a23] rounded-full px-2 text-xs font-bold min-w-[20px] text-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}