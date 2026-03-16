export default function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-10 w-64 bg-[#1a1a40] rounded mb-6" />
        <div className="h-20 bg-[#1a1a40] rounded-xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-[#1a1a40] border border-gold/20 rounded-xl overflow-hidden">
              <div className="h-44 bg-[#0a0a23]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#0a0a23] rounded w-4/5" />
                <div className="h-3 bg-[#0a0a23] rounded w-2/5" />
                <div className="h-6 bg-[#0a0a23] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
