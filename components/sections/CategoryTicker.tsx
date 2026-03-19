"use client";

import React from "react";
import Link from "next/link";

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
          {[...categories, ...categories].map((cat, idx) => (
            <Link
              key={cat + idx}
              href={`/collections?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
              prefetch
              className="inline-block min-w-[140px] text-center px-5 py-1.5 rounded-full bg-[#0B1A2F] text-gold font-semibold text-sm border border-gold whitespace-nowrap hover:bg-gold hover:text-[#0B1A2F] transition cursor-pointer"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
