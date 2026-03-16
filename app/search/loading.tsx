export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] py-8 px-4">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-10 w-64 bg-[#1a1a40] rounded-lg mx-auto mb-8" />
        <div className="h-14 w-full bg-[#1a1a40] rounded-xl mb-8" />
        <div className="bg-[#1a1a40] border border-gold/20 rounded-xl p-6">
          <div className="h-6 w-48 bg-[#0a0a23] rounded mb-4" />
          <div className="space-y-3">
            <div className="h-16 bg-[#0a0a23] rounded" />
            <div className="h-16 bg-[#0a0a23] rounded" />
            <div className="h-16 bg-[#0a0a23] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
