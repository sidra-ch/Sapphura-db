"use client";

export default function SkeletonCollectionsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="relative overflow-hidden rounded-2xl border border-gold/30 bg-[#1a1a40] p-4">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="h-52 w-full rounded-xl bg-[#0d1230] mb-4" />
          <div className="h-5 w-2/3 rounded bg-[#0d1230] mb-2" />
          <div className="h-4 w-1/2 rounded bg-[#0d1230] mb-3" />
          <div className="h-8 w-1/3 rounded bg-[#0d1230]" />
        </div>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
