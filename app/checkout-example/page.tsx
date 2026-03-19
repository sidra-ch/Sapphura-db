import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createOrderForAuthenticatedUser } from '../../lib/createOrder'

async function createOrderAction(formData: FormData) {
  'use server'

  const authState = await auth()
  if (!authState.userId) {
    redirect('/sign-in')
  }

  const product = String(formData.get('product') || '')
  const amount = Number(formData.get('amount') || 0)

  await createOrderForAuthenticatedUser({ product, amount })
  redirect('/protected')
}

export default async function CheckoutExamplePage() {
  const authState = await auth()
  if (!authState.userId) {
    redirect('/sign-in')
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-semibold">Checkout Example</h1>
      <p className="mb-8 text-sm text-white/70">This form creates an order in PostgreSQL using Clerk-authenticated identity.</p>

      <form action={createOrderAction} className="space-y-4 rounded-xl border border-white/20 bg-white/5 p-5">
        <div>
          <label htmlFor="product" className="mb-1 block text-sm">Product Name</label>
          <input
            id="product"
            name="product"
            required
            className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
            placeholder="Sapphura Silk Dress"
          />
        </div>

        <div>
          <label htmlFor="amount" className="mb-1 block text-sm">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            className="w-full rounded border border-white/20 bg-transparent px-3 py-2"
            placeholder="14999"
          />
        </div>

        <button type="submit" className="rounded bg-gold px-4 py-2 font-medium text-[#0a0a23]">
          Place Order
        </button>
      </form>
    </main>
  )
}
