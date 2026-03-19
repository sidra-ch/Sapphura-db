import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getOrCreatePrismaUser } from '../../lib/prismaUser'
import { getCurrentClerkRole } from '../../lib/clerk-rbac'

export default async function AdminPage() {
  const authState = await auth()
  if (!authState.userId) {
    redirect('/sign-in')
  }

  const prismaUser = await getOrCreatePrismaUser()

  const role = await getCurrentClerkRole()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold">Admin Console</h1>
      <p className="mb-8 text-sm text-white/70">This route is restricted to users with role=admin in Clerk public metadata.</p>

      <div className="space-y-3 rounded-xl border border-white/20 bg-white/5 p-5">
        <p><strong>Clerk User ID:</strong> {authState.userId}</p>
        <p><strong>Email:</strong> {prismaUser.email}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Prisma User ID:</strong> {prismaUser.id}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/admin/orders" className="rounded bg-gold px-4 py-2 text-[#0a0a23]">Manage Orders</Link>
        <Link href="/admin/products" className="rounded border border-gold px-4 py-2 text-gold">Manage Products</Link>
      </div>
    </main>
  )
}
