"use client";
import React from "react";
import { ShoppingCart, Heart } from "lucide-react";

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  // Dummy data for now, can be replaced with real fetch
  const collection = {
    title: decodeURIComponent(params.slug.replace(/-/g, ' ')),
    image: `https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/products/${params.slug}.jpg`,
    description: "Luxury details and exclusive offers for this collection.",
    price: "Rs. 4,999",
    discount: "20% OFF"
  };

  return (
    <main className="min-h-screen bg-[#0a0a23] py-16 px-4 md:px-16">
      <div className="max-w-3xl mx-auto bg-[#1a1a40] rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8 border border-gold">
        <img src={collection.image} alt={collection.title} className="w-full md:w-96 h-72 object-cover rounded-xl border-4 border-gold shadow-lg" />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">{collection.title}</h2>
            <span className="bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow mb-4 inline-block">{collection.discount}</span>
            <p className="text-white/80 mb-6">{collection.description}</p>
            <div className="text-2xl font-semibold text-gold mb-6">{collection.price}</div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-black/60 text-gold font-semibold shadow hover:text-red-500 transition">
              <Heart className="w-5 h-5" /> Wishlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
