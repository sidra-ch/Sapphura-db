import Link from 'next/link'

export default function AccessDeniedPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold/80">Restricted Area</p>
      <h1 className="text-3xl font-semibold text-white">Access Denied</h1>
      <p className="mt-4 max-w-xl text-sm text-white/70">
        Your account is signed in, but it does not have permission to access this admin area.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="rounded bg-gold px-4 py-2 text-sm font-semibold text-[#0a0a23]">
          Return Home
        </Link>
        <Link href="/account" className="rounded border border-gold px-4 py-2 text-sm font-semibold text-gold">
          Go to My Account
        </Link>
      </div>
    </main>
  )
}