import Link from 'next/link';

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a23] to-[#1a1a40] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-[#121237] p-8 text-white">
        <h1 className="mb-4 text-3xl font-bold text-gold">How To Order</h1>
        <p className="mb-3 text-white/80">1. Browse products and add items to cart.</p>
        <p className="mb-3 text-white/80">2. Go to checkout and enter shipping details.</p>
        <p className="mb-6 text-white/80">3. Complete payment and receive confirmation.</p>
        <Link href="/collections" className="inline-block rounded-lg bg-gold px-5 py-3 font-semibold text-[#0a0a23] hover:bg-yellow-300 transition">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
