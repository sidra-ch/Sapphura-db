export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-8 w-40 bg-[#1a1a40] rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="h-[500px] bg-[#1a1a40] rounded-2xl" />
            <div className="flex gap-3 mt-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="w-20 h-20 bg-[#1a1a40] rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-[#1a1a40] rounded" />
            <div className="h-10 w-3/4 bg-[#1a1a40] rounded" />
            <div className="h-8 w-1/2 bg-[#1a1a40] rounded" />
            <div className="h-24 w-full bg-[#1a1a40] rounded" />
            <div className="h-12 w-full bg-[#1a1a40] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
