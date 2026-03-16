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
        <div className="marquee-track">
          {/* Duplicated twice for seamless infinite loop */}
          {[...categories, ...categories].map((cat, idx) => (
            <Link
              key={cat + idx}
              href={`/collections?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
              prefetch
              className="marquee-chip"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: marquee 24s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-chip {
          display: inline-block;
          min-width: 140px;
          text-align: center;
          padding: 0.375rem 1.25rem;
          border-radius: 9999px;
          background: #0B1A2F;
          color: #d4af37;
          font-weight: 600;
          font-size: 0.875rem;
          border: 1px solid #d4af37;
          white-space: nowrap;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
        }
        .marquee-chip:hover {
          background: #d4af37;
          color: #0B1A2F;
        }
      `}</style>
    </div>
  );
}
