import React from "react";

export default function SkeletonCollectionsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="animate-pulse bg-[#1a1a40] rounded-xl p-4 shadow-xl border border-gold">
          <div className="w-full h-56 bg-[#081220] rounded-xl mb-4" />
          <div className="w-2/3 h-6 bg-[#081220] rounded mb-2" />
          <div className="w-1/3 h-5 bg-[#081220] rounded mb-2" />
          <div className="w-1/2 h-8 bg-[#081220] rounded mt-2" />
        </div>
      ))}
    </div>
  );
}
