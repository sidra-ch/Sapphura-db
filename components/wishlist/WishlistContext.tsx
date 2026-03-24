"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const WISHLIST_STORAGE_KEY = 'wishlist-v2';
const LEGACY_WISHLIST_STORAGE_KEY = 'wishlist';

interface WishlistItem {
  id: string;
  slug?: string;
  name: string;
  image: string;
  price: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  totalItems: number;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        }
      }
      localStorage.removeItem(LEGACY_WISHLIST_STORAGE_KEY);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToWishlist = (item: WishlistItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, ...item } : i));
      }

      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const isInWishlist = (id: string) => items.some(i => i.id === id);

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      totalItems: items.length,
      isHydrated
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      items: [],
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      isInWishlist: () => false,
      totalItems: 0,
      isHydrated: false
    };
  }
  return context;
}
