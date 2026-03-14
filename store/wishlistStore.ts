import { create } from 'zustand';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  addItem: (item: WishlistItem) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id: string) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clearWishlist: () => set(() => ({ items: [] })),
}));
