import React from "react";

export default function SkeletonCartDrawer() {
  return (
    <div className="animate-pulse w-full max-w-md h-full bg-[#0a0a23] border-l border-gold shadow-2xl p-8 flex flex-col relative">
      <div className="w-2/3 h-8 bg-[#081220] rounded mb-6" />
      <div className="flex-1 overflow-y-auto">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-6 border-b border-gold pb-4">
            <div className="w-16 h-16 bg-[#081220] rounded-lg" />
            <div className="flex-1">
              <div className="w-1/2 h-6 bg-[#081220] rounded mb-2" />
              <div className="w-1/3 h-5 bg-[#081220] rounded mb-2" />
              <div className="w-1/4 h-6 bg-[#081220] rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <div className="w-full h-10 bg-[#081220] rounded mb-4" />
        <div className="w-full h-10 bg-[#081220] rounded" />
      </div>
    </div>
  );
}
