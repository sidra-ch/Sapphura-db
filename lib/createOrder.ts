import { auth } from '@clerk/nextjs/server'
import prisma from './prisma'
import { getOrCreatePrismaUser } from './prismaUser'

interface CreateOrderInput {
  product: string
  amount: number
}

export async function createOrderForAuthenticatedUser(input: CreateOrderInput) {
  const authState = await auth()
  if (!authState.userId) {
    throw new Error('Unauthorized: login is required to create an order.')
  }

  const product = String(input.product || '').trim()
  const amount = Number(input.amount)

  if (!product) {
    throw new Error('Product is required.')
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be greater than zero.')
  }

  const user = await getOrCreatePrismaUser()

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: amount,
      status: 'pending',
      paymentStatus: 'pending',
      shippingCost: 0,
      discount: 0,
      notes: `Checkout item: ${product}`,
    },
    select: {
      id: true,
      userId: true,
      total: true,
      notes: true,
      status: true,
      createdAt: true,
    },
  })

  console.log('[order-create] Created order:', order.id)
  return order
}
