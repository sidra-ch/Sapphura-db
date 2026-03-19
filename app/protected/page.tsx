import Link from 'next/link'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreatePrismaUser } from '../../lib/prismaUser'

function resolveRole(metadata: unknown): string {
  if (!metadata || typeof metadata !== 'object') {
    return 'user'
  }

  const role = (metadata as Record<string, unknown>).role
  return typeof role === 'string' && role.length > 0 ? role : 'user'
}

export default async function ProtectedPage() {
  const authState = await auth()
  if (!authState.userId) {
    redirect('/sign-in')
  }

  const [clerkUser, prismaUser] = await Promise.all([
    currentUser(),
    getOrCreatePrismaUser(),
  ])

  const role = resolveRole(clerkUser?.publicMetadata)

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold">Protected Page</h1>
      <p className="mb-8 text-sm text-white/70">Only authenticated users can access this page.</p>

      <div className="space-y-3 rounded-xl border border-white/20 bg-white/5 p-5">
        <p><strong>Clerk User ID:</strong> {authState.userId}</p>
        <p><strong>Email:</strong> {prismaUser.email}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Prisma User ID:</strong> {prismaUser.id}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/checkout-example" className="rounded bg-gold px-4 py-2 text-[#0a0a23]">Go to Checkout Example</Link>
        <Link href="/admin" className="rounded border border-gold px-4 py-2 text-gold">Go to Admin</Link>
      </div>
    </main>
  )
}
