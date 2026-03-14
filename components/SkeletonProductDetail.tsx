import React from "react";

export default function SkeletonProductDetail() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="w-full h-[420px] bg-[#081220] rounded-xl mb-4" />
      <div className="flex flex-col gap-6">
        <div className="w-2/3 h-8 bg-[#081220] rounded mb-2" />
        <div className="w-1/3 h-6 bg-[#081220] rounded mb-2" />
        <div className="w-full h-20 bg-[#081220] rounded mb-4" />
        <div className="w-1/2 h-8 bg-[#081220] rounded mb-2" />
        <div className="w-1/2 h-8 bg-[#081220] rounded mb-2" />
        <div className="w-1/2 h-8 bg-[#081220] rounded mb-2" />
      </div>
    </div>
  );
}
