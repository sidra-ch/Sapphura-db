import React from 'react';

const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="relative overflow-hidden rounded-2xl border border-gold/20 bg-[#1a1a40] p-4">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="h-40 rounded-xl bg-[#0d1230] mb-4" />
        <div className="h-4 w-2/3 rounded bg-[#0d1230] mb-2" />
        <div className="h-4 w-1/2 rounded bg-[#0d1230]" />
      </div>
    ))}
    <style jsx>{`
      @keyframes shimmer {
        100% { transform: translateX(200%); }
      }
    `}</style>
  </div>
);

export default GridSkeleton;
