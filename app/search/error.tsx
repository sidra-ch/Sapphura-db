"use client";

export default function SearchError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1a1a40] border border-gold/30 rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-gold mb-3">Search Unavailable</h2>
        <p className="text-white/75 text-sm mb-6">{error.message || "Something went wrong while loading search."}</p>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg bg-gold text-[#0a0a23] font-semibold hover:bg-yellow-400 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
