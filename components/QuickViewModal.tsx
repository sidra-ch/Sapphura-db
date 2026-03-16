import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickViewModal({ product, open, onClose }: { product: any, open: boolean, onClose: () => void }) {
  if (!open) return null;
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Gold");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [quantity, setQuantity] = useState(1);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0a0a23] rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gold text-xl font-bold">×</button>
          <img src={product.image} alt={product.name} className="w-full h-44 object-cover rounded-xl mb-5 border border-gold" />
          <h2 className="text-2xl font-bold text-gold mb-2">{product.name}</h2>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gold">{product.discountPrice || product.price}</span>
            {product.discountPrice && <span className="text-base line-through text-white/60">{product.price}</span>}
          </div>
          <div className="mb-2">
            <span className="text-gold font-semibold mr-2">Color:</span>
            {product.colors?.map((color: string) => (
              <button key={color} onClick={() => setSelectedColor(color)} className={`inline-block w-8 h-8 rounded-full border-2 border-gold mx-1 ${selectedColor === color ? "ring-2 ring-gold" : ""} bg-black/60 hover:bg-gold transition`} style={{ backgroundColor: color.toLowerCase() }} />
            ))}
          </div>
          <div className="mb-2">
            <span className="text-gold font-semibold mr-2">Size:</span>
            {product.sizes?.map((size: string) => (
              <button key={size} onClick={() => setSelectedSize(size)} className={`inline-block px-4 py-2 m-1 rounded-full bg-black/60 text-gold font-bold border border-gold hover:bg-gold hover:text-[#0a0a23] transition ${selectedSize === size ? "ring-2 ring-gold" : ""}`}>{size}</button>
            ))}
          </div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-gold font-semibold mr-2">Quantity:</span>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 bg-black/60 text-gold rounded-full border border-gold">-</button>
            <span className="px-4 py-1 bg-gold text-[#0a0a23] rounded-full font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 bg-black/60 text-gold rounded-full border border-gold">+</button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition mt-4 mx-auto">
            <ShoppingCart className="w-5 h-5" /> Add to Cart
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
