"use client";
// ...existing code...
import { ShoppingCart, Heart } from "lucide-react";

import React from "react";
export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  // Use params.slug directly
  const slug = params?.slug ?? "";
  // Demo product type logic
  let productType = "clothes";
  if (slug.includes("ring")) productType = "ring";
  else if (slug.includes("earring")) productType = "earring";
  else if (slug.includes("bangle")) productType = "bangle";
  else if (slug.includes("necklace")) productType = "necklace";
  // Demo options
  const sizes = productType === "clothes" || productType === "ring" ? ["S", "M", "L", "XL"] : [];
  const colors = productType === "earring" ? ["Gold", "Silver", "Rose Gold", "Emerald"] : [];
  const inStock = true;
  const collection = {
    title: decodeURIComponent(slug.replace(/-/g, ' ')),
    image: `/public/${slug}.jpeg`,
    description: "Luxury details and exclusive offers for this collection.",
    price: "Rs. 4,999",
    discount: "20% OFF"
  };
  // Demo similar products
  const similarProducts = [
    { title: "Summer Collection", image: "/summer-1.jpeg" },
    { title: "Winter Collection", image: "/winter-collection1.jpeg" },
    { title: "Bangle Bliss", image: "/bangals-1.jpeg" },
    { title: "Necklace Dream", image: "/neckles-1.jpeg" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-20 px-4 md:px-24">
      <div className="max-w-7xl mx-auto bg-[#18182f] rounded-3xl shadow-2xl p-12 flex flex-col md:flex-row gap-16 border-4 border-gold">
        {/* Big image with hover effect */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative w-full md:w-[520px] h-[420px] group">
            <img src={collection.image} alt={collection.title} className="w-full h-full object-cover rounded-2xl border-4 border-gold shadow-xl group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute top-6 left-6 bg-gold text-[#0a0a23] font-bold px-4 py-2 rounded-full text-base shadow-xl">{collection.discount}</span>
          </div>
          <div className="mt-6">
            {inStock ? (
              <span className="text-green-400 font-bold text-xl">In Stock</span>
            ) : (
              <span className="text-red-400 font-bold text-xl">Out of Stock</span>
            )}
          </div>
        </div>
        {/* Product details and options */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-5xl font-extrabold text-gold mb-6 drop-shadow-lg">{collection.title}</h2>
            <p className="text-white/90 mb-8 text-lg">{collection.description}</p>
            <div className="text-3xl font-bold text-gold mb-8">{collection.price}</div>
            {/* Size options */}
            {sizes.length > 0 && (
              <div className="mb-8">
                <span className="text-gold font-semibold mr-4 text-lg">Size:</span>
                {sizes.map(size => (
                  <button key={size} className="inline-block px-6 py-3 m-2 rounded-full bg-black/60 text-gold font-bold border-2 border-gold hover:bg-gold hover:text-[#0a0a23] text-lg transition">{size}</button>
                ))}
              </div>
            )}
            {/* Color options */}
            {colors.length > 0 && (
              <div className="mb-8">
                <span className="text-gold font-semibold mr-4 text-lg">Color:</span>
                {colors.map(color => (
                  <button key={color} className="inline-block px-6 py-3 m-2 rounded-full bg-black/60 text-gold font-bold border-2 border-gold hover:bg-gold hover:text-[#0a0a23] text-lg transition">{color}</button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-6 mt-8">
            <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-gold text-[#0a0a23] font-bold text-lg shadow-xl hover:bg-yellow-400 transition">
              <ShoppingCart className="w-6 h-6" /> Add to Cart
            </button>
            <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-black/60 text-gold font-bold text-lg shadow-xl hover:text-red-500 transition">
              <Heart className="w-6 h-6" /> Wishlist
            </button>
          </div>
        </div>
      </div>
      {/* Similar products section */}
      <div className="max-w-7xl mx-auto mt-24">
        <h3 className="text-3xl font-bold text-gold mb-10">Similar Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {similarProducts.map(prod => (
            <div key={prod.title} className="relative rounded-2xl overflow-hidden shadow-xl bg-[#18182f] border-2 border-gold cursor-pointer group">
              <img src={prod.image} alt={prod.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-0 left-0 w-full bg-black/70 p-6">
                <span className="text-gold font-bold text-xl">{prod.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
