import { NextRequest, NextResponse } from 'next/server';

import prisma from '../../../../../lib/db';
import { isPaymentTransactionTableMissing } from '../../../../../lib/payment-transaction-utils';

async function findOrderByIdentifier(orderIdentifier: string) {
  const numericId = Number(orderIdentifier);

  if (Number.isInteger(numericId) && numericId > 0) {
    const byNumeric = await prisma.order.findUnique({ where: { id: numericId } });
    if (byNumeric) {
      return byNumeric;
    }
  }

  return prisma.order.findUnique({ where: { publicId: orderIdentifier } });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await findOrderByIdentifier(String(id || '').trim());

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let latestTransaction: {
      provider: string;
      status: string;
      merchantReference: string;
      updatedAt: Date;
    } | null = null;

    try {
      latestTransaction = await prisma.paymentTransaction.findFirst({
        where: { orderId: order.id },
        orderBy: { createdAt: 'desc' },
        select: {
          provider: true,
          status: true,
          merchantReference: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (!isPaymentTransactionTableMissing(error)) {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.publicId || String(order.id),
        legacyId: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        updatedAt: order.updatedAt,
      },
      latestTransaction,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch order status' },
      { status: 500 }
    );
  }
}