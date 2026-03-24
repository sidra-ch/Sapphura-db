"use client";

import { CartProvider } from './cart/CartContext';
import { WishlistProvider } from './wishlist/WishlistContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
