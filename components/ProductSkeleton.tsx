import React from 'react';

const ProductSkeleton = () => (
  <div className="relative overflow-hidden h-52 w-full rounded-xl border border-gold/20 bg-[#1a1a40]">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.7s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="h-full w-full bg-[#0d1230]" />
    <style jsx>{`
      @keyframes shimmer {
        100% { transform: translateX(200%); }
      }
    `}</style>
  </div>
);

export default ProductSkeleton;
