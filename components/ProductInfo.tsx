import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductInfo({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const router = typeof window !== "undefined" ? require("next/router").useRouter() : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        {product.isBestSeller && <span className="bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow">Best Seller</span>}
        <span className="bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gold mb-2">{product.name}</h1>
      <div className="flex items-center gap-4 mb-2">
        <span className="text-2xl font-semibold text-gold">Rs. {product.discountPrice}</span>
        <span className="text-lg line-through text-white/60">Rs. {product.price}</span>
      </div>
      <p className="text-white/80 mb-4">{product.description}</p>
      {/* Color Selector */}
      <div className="mb-2">
        <span className="text-gold font-semibold mr-2">Color:</span>
        {product.colors.map((color: string) => (
          <button key={color} onClick={() => setSelectedColor(color)} className={`inline-block w-8 h-8 rounded-full border-2 border-gold mx-1 ${selectedColor === color ? "ring-2 ring-gold" : ""} bg-black/60 hover:bg-gold transition`} style={{ backgroundColor: color.toLowerCase() }} />
        ))}
      </div>
      {/* Size Selector */}
      <div className="mb-2">
        <span className="text-gold font-semibold mr-2">Size:</span>
        {product.sizes.map((size: string) => (
          <button key={size} onClick={() => setSelectedSize(size)} className={`inline-block px-4 py-2 m-1 rounded-full bg-black/60 text-gold font-bold border border-gold hover:bg-gold hover:text-[#0a0a23] transition ${selectedSize === size ? "ring-2 ring-gold" : ""}`}>{size}</button>
        ))}
      </div>
      {/* Quantity Selector */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-gold font-semibold mr-2">Quantity:</span>
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 bg-black/60 text-gold rounded-full border border-gold">-</button>
        <span className="px-4 py-1 bg-gold text-[#0a0a23] rounded-full font-bold">{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 bg-black/60 text-gold rounded-full border border-gold">+</button>
      </div>
      {/* Add to Cart & Wishlist */}
      <div className="flex gap-4">
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition"
          onClick={() => {
            // Add to cart logic here (if any)
            if (router) router.push("/cart");
          }}
        >
          <ShoppingCart className="w-5 h-5" /> Add to Cart
        </button>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/60 text-gold font-semibold shadow hover:text-red-500 transition">
          <Heart className="w-5 h-5" /> Wishlist
        </button>
      </div>
      <div className="mt-4">
        <span className="text-white/70 text-sm">Free Shipping • Estimated Delivery 3–5 days • Easy Returns</span>
      </div>
    </div>
  );
}
