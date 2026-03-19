import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '../../lib/prisma'
import { getOrCreatePrismaUser } from '../../lib/prismaUser'

function formatMoney(value: number) {
  return `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function toStatusBadgeClass(status: string) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'completed' || normalized === 'delivered' || normalized === 'paid') return 'bg-green-500/20 text-green-300 border-green-400/30'
  if (normalized === 'shipped' || normalized === 'processing') return 'bg-blue-500/20 text-blue-300 border-blue-400/30'
  if (normalized === 'cancelled' || normalized === 'failed') return 'bg-red-500/20 text-red-300 border-red-400/30'
  return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
}

export default async function AccountPage() {
  const authState = await auth()
  if (!authState.userId) {
    redirect('/sign-in')
  }

  const prismaUser = await getOrCreatePrismaUser()

  const orders = await prisma.order.findMany({
    where: { userId: prismaUser.id },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 25,
  })

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">My Account</h1>
          <p className="mt-2 text-sm text-white/70">Welcome back, {prismaUser.name || prismaUser.email}</p>
        </div>
        <Link href="/collections" className="rounded border border-gold px-4 py-2 text-gold">Continue Shopping</Link>
      </div>

      <section className="mb-8 rounded-xl border border-white/20 bg-white/5 p-5">
        <h2 className="mb-4 text-xl font-semibold">Profile</h2>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p><strong>Email:</strong> {prismaUser.email}</p>
          <p><strong>Role:</strong> {prismaUser.role}</p>
          <p><strong>User ID:</strong> {prismaUser.id}</p>
          <p><strong>Joined:</strong> {new Date(prismaUser.createdAt).toLocaleDateString()}</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/20 bg-white/5 p-5">
        <h2 className="mb-4 text-xl font-semibold">My Orders</h2>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/20 p-6 text-center text-white/70">
            No orders yet. Place your first order from the store.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-white/20 bg-[#0a0a23]/40 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-white/70">Order #{order.publicId || order.id}</p>
                  <span className={`rounded-full border px-3 py-1 text-xs ${toStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-3 grid gap-2 text-sm sm:grid-cols-4">
                  <p><strong>Total:</strong> {formatMoney(order.total)}</p>
                  <p><strong>Payment:</strong> {order.paymentStatus}</p>
                  <p><strong>Method:</strong> {order.paymentMethod || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="rounded-md border border-white/10 p-3">
                  <p className="mb-2 text-xs uppercase tracking-wide text-white/60">Items</p>
                  <ul className="space-y-1 text-sm">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between gap-2">
                        <span>
                          {item.product?.name || `Product #${item.productId}`} x {item.quantity}
                        </span>
                        <span>{formatMoney(item.price * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
