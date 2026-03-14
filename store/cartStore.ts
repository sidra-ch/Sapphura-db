import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item: CartItem) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id: string) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clearCart: () => set(() => ({ items: [] })),
}));
