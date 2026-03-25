import Link from 'next/link'
import { Package, ShoppingCart, Users, Star, ArrowRight, ArrowLeft, ChartNoAxesCombined, Settings } from 'lucide-react'

import prisma from '../../lib/prisma'
import { getOrCreatePrismaUser } from '../../lib/prismaUser'

export default async function AdminPage() {
  const prismaUser = await getOrCreatePrismaUser()
  const [productCount, orderCount, customerCount, reviewCount, pendingOrders, lowStockProducts, featuredProducts] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'customer' } }),
    prisma.review.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.product.count({ where: { stock: { lte: 5 }, status: 'active' } }),
    prisma.product.count({ where: { isFeatured: true, status: 'active' } }),
  ])

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  })

  const dashboardCards = [
    {
      title: 'Products',
      value: productCount,
      note: `${featuredProducts} featured live`,
      href: '/admin/products',
      icon: Package,
    },
    {
      title: 'Orders',
      value: orderCount,
      note: `${pendingOrders} pending review`,
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Customers',
      value: customerCount,
      note: 'Registered shoppers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      title: 'Reviews',
      value: reviewCount,
      note: `${lowStockProducts} low stock items`,
      href: '/admin/reviews',
      icon: Star,
    },
  ]

  const quickLinks = [
    { href: '/admin/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
    { href: '/admin/products', label: 'Manage Products', icon: Package },
    { href: '/admin/orders', label: 'Manage Orders', icon: ShoppingCart },
    { href: '/admin/settings', label: 'Store Settings', icon: Settings },
  ]

  return (
    <main className="min-h-screen bg-[#0a0a23] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-gold/80">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Welcome back, {prismaUser.name || prismaUser.email}</h1>
            <p className="mt-3 max-w-2xl text-white/65">
              Monitor products, orders, customers, and reviews from one place. Your admin access is now resolved using the stored app role as well.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-[#0a0a23]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-white/5 px-5 py-4 text-sm text-white/75">
            <p><span className="font-semibold text-gold">Email:</span> {prismaUser.email}</p>
            <p className="mt-2"><span className="font-semibold text-gold">App Role:</span> {prismaUser.role}</p>
          </div>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-[24px] border border-gold/15 bg-[linear-gradient(180deg,rgba(26,26,64,0.95),rgba(10,10,35,0.98))] p-6 transition-all hover:-translate-y-1 hover:border-gold/35 hover:shadow-[0_22px_50px_rgba(0,0,0,0.28)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-gold/10 p-3 text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </div>
                <p className="mt-6 text-sm uppercase tracking-[0.22em] text-white/55">{card.title}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{card.value}</p>
                <p className="mt-2 text-sm text-white/55">{card.note}</p>
              </Link>
            )
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-gold/15 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-gold/80">Recent orders</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Latest customer activity</h2>
              </div>
              <Link href="/admin/orders" className="rounded-full border border-gold/25 px-4 py-2 text-sm text-gold hover:bg-gold hover:text-[#0a0a23]">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0f1632] px-5 py-6 text-white/60">
                  No orders yet.
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0f1632] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-white">Order #{order.id}</p>
                      <p className="mt-1 text-sm text-white/60">{order.user.name || order.user.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-gold">
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-white">PKR {order.total.toFixed(0)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-gold/15 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.26em] text-gold/80">Quick actions</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Open admin tools</h2>
            <div className="mt-6 space-y-3">
              {quickLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f1632] px-4 py-4 transition-all hover:border-gold/30 hover:bg-[#121b3b]">
                    <span className="flex items-center gap-3 text-white">
                      <span className="rounded-xl bg-gold/10 p-2 text-gold">
                        <Icon className="h-4 w-4" />
                      </span>
                      {item.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/40" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
