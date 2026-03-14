import React from 'react';

const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-200 h-48 w-full rounded mb-2" />
    ))}
  </div>
);

export default GridSkeleton;
