import React from "react";

export default function SkeletonProductCard() {
  return (
    <div className="animate-pulse bg-[#1a1a40] rounded-xl p-4 shadow-lg flex flex-col items-center border border-gold">
      <div className="w-full h-32 bg-[#081220] rounded-lg mb-2" />
      <div className="w-2/3 h-6 bg-[#081220] rounded mb-1" />
      <div className="w-1/3 h-5 bg-[#081220] rounded mb-2" />
      <div className="w-1/2 h-8 bg-[#081220] rounded mt-2" />
    </div>
  );
}