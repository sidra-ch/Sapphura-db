"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, House } from 'lucide-react';

export default function MobileBackHomeNav() {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 left-1/2 z-[70] w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 md:hidden">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-gold/30 bg-[#0b1a2f]/95 p-2 shadow-xl backdrop-blur">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gold/30 bg-[#0a0a23] px-3 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <Link
          href="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold px-3 py-2 text-sm font-bold text-[#0a0a23] transition hover:bg-yellow-400"
          aria-label="Go to homepage"
        >
          <House className="h-4 w-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
