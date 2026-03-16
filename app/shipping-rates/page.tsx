export default function ShippingRatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-[#121237] p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold text-gold">Shipping Rates</h1>
        <p className="mb-3 text-white/80">Standard shipping charges are calculated at checkout based on your location.</p>
        <p className="mb-3 text-white/80">Express shipping may be available in selected areas.</p>
        <p className="text-white/80">For exact delivery timelines, contact support before placing your order.</p>
      </div>
    </div>
  );
}
