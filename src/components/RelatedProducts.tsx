import React from "react";

export default function RelatedProducts({ categoryId }: { categoryId: number }) {
  // Demo related products
  const products = [
    { name: "Bangle Bliss", image: "/bangals-1.jpeg", price: 2999 },
    { name: "Necklace Dream", image: "/neckles-1.jpeg", price: 3999 },
    { name: "Earring Perfection", image: "/earing-1.jpeg", price: 1999 },
    { name: "Bracelet Chic", image: "/bracelet-1.jpeg", price: 2499 }
  ];
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-gold mb-4">You may also like</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {products.map((p, idx) => (
          <div key={idx} className="bg-[#1a1a40] rounded-xl p-4 shadow-lg flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-lg mb-2" />
            <span className="text-gold font-bold text-lg mb-1">{p.name}</span>
            <span className="text-white font-semibold">Rs. {p.price}</span>
            <button className="mt-2 px-4 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition">Quick Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}
