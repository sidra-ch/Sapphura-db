"use client";
import React from "react";
import { Star } from "lucide-react";

export default function Reviews() {
  // Demo reviews
  const reviews = [
    { name: "Ayesha", rating: 5, comment: "Beautiful product!" },
    { name: "Sara", rating: 4, comment: "Loved the quality." },
    { name: "Fatima", rating: 5, comment: "Fast delivery and great packaging." }
  ];
  return (
    <div className="max-w-6xl mx-auto mt-12">
      <h3 className="text-2xl font-bold text-gold mb-4">Customer Reviews</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <div key={idx} className="bg-[#1a1a40] rounded-xl p-6 shadow-lg flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-gold" />)}
              <span className="text-white font-bold ml-2">{r.name}</span>
            </div>
            <div className="text-white/80">{r.comment}</div>
          </div>
        ))}
      </div>
      <form className="mt-8 flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="px-4 py-2 rounded-lg bg-black/60 text-white border border-gold" />
        <textarea placeholder="Your Review" className="px-4 py-2 rounded-lg bg-black/60 text-white border border-gold" />
        <button className="px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition">Submit Review</button>
      </form>
    </div>
  );
}
