import React from "react";

const categories = [
  "Necklace Sets",
  "Earrings",
  "Rings",
  "Bracelets",
  "Bangles",
  "Jewelry Sets",
  "Makeup",
  "Clothes",
  "Summer Suits",
  "Winter Suits"
];

export default function CategoryTicker() {
  return (
    <div className="w-full bg-[#081220] py-3 overflow-hidden border-b border-gold">
      <div className="relative w-full flex items-center">
        <div className="animate-marquee flex gap-4">
          {categories.map((cat, idx) => (
            <a
              key={cat + idx}
              href={`/category/${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-6 py-2 rounded-full bg-[#0B1A2F] text-gold font-semibold shadow hover:bg-gold hover:text-[#0B1A2F] transition border border-gold hover:glow"
              style={{ minWidth: "140px", textAlign: "center" }}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
