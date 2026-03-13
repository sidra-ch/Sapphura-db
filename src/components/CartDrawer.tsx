import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

const demoCart = [
  {
    id: 1,
    name: "Luxury Necklace",
    image: "/neckles-1.jpeg",
    price: 3999,
    quantity: 1
  },
  {
    id: 2,
    name: "Gold Ring",
    image: "/ring-1.jpeg",
    price: 1499,
    quantity: 2
  }
];

export default function CartDrawer({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [cart, setCart] = useState(demoCart);

  if (!open) return null;

  const removeItem = (id: number) => setCart(cart.filter(item => item.id !== id));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md h-full bg-[#0a0a23] border-l border-gold shadow-2xl p-8 flex flex-col relative"
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gold text-xl font-bold"><X className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-gold mb-6 flex items-center gap-2"><ShoppingBag className="w-6 h-6" /> Cart</h2>
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-white/80 text-center mt-16">Your cart is empty.</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 mb-6 border-b border-gold pb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gold" />
                  <div className="flex-1">
                    <div className="text-gold font-bold text-lg">{item.name}</div>
                    <div className="text-white/80">Rs. {item.price}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white/70">Qty:</span>
                      <span className="bg-gold text-[#0a0a23] rounded px-3 py-1 font-bold">{item.quantity}</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 ml-2">Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8">
            <button className="w-full px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition mb-4">View Cart</button>
            <button className="w-full px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow hover:bg-green-400 transition">Proceed to Checkout</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
