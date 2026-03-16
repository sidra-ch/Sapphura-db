import React from "react";

export default function SkeletonProductCard() {
  return (
    <div className="relative overflow-hidden bg-[#1a1a40] rounded-2xl p-4 shadow-lg flex flex-col border border-gold/30">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="w-full h-48 bg-[#081220] rounded-xl mb-4" />
      <div className="w-2/3 h-5 bg-[#081220] rounded mb-2" />
      <div className="w-full h-4 bg-[#081220] rounded mb-2" />
      <div className="w-1/2 h-6 bg-[#081220] rounded mt-auto" />
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}