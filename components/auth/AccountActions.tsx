"use client";

import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function AccountActions({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Link href="/collections" className="rounded-xl border border-gold/25 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white hover:border-gold/45 hover:text-gold">
        Continue Shopping
      </Link>
      {isAdmin ? (
        <Link href="/admin" className="rounded-xl bg-gold px-4 py-3 text-center text-sm font-semibold text-[#0a0a23] hover:bg-yellow-400">
          Open Admin Dashboard
        </Link>
      ) : (
        <Link href="/orders" className="rounded-xl border border-gold/25 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white hover:border-gold/45 hover:text-gold">
          View Orders
        </Link>
      )}
      <SignOutButton>
        <button className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20">
          Logout
        </button>
      </SignOutButton>
    </div>
  )
}