import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { reconcileProviderPayment } from '../../../../lib/payments';
import { isPaymentTransactionTableMissing, PAYMENT_TRANSACTION_SETUP_MESSAGE } from '../../../../lib/payment-transaction-utils';

type Provider = 'jazzcash' | 'easypaisa';

function mapOrderState(status: 'paid' | 'failed' | 'pending') {
  if (status === 'paid') {
    return { paymentStatus: 'paid', status: 'paid' };
  }
  if (status === 'failed') {
    return { paymentStatus: 'failed', status: 'pending' };
  }
  return { paymentStatus: 'pending', status: 'pending' };
}

export async function POST(req: NextRequest) {
  const reconcileKey = req.headers.get('x-reconcile-key');
  if (!process.env.PAYMENT_RECONCILE_KEY || reconcileKey !== process.env.PAYMENT_RECONCILE_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let pending = [];

    try {
      pending = await prisma.paymentTransaction.findMany({
        where: {
          status: { in: ['initiated', 'pending'] },
        },
        orderBy: { createdAt: 'asc' },
        take: 100,
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ success: true, processed: 0, updated: [], warning: PAYMENT_TRANSACTION_SETUP_MESSAGE });
      }

      throw error;
    }

    const updated: Array<{ id: number; merchantReference: string; status: string }> = [];

    for (const transaction of pending) {
      const provider = transaction.provider as Provider;
      if (!['jazzcash', 'easypaisa'].includes(provider)) {
        continue;
      }

      const result = await reconcileProviderPayment(provider, transaction.merchantReference);
      const orderState = mapOrderState(result.status);

      await prisma.$transaction([
        prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: result.status,
            responsePayload: result.raw as object,
            reconciledAt: new Date(),
          },
        }),
        prisma.order.update({
          where: { id: transaction.orderId },
          data: orderState,
        }),
      ]);

      updated.push({ id: transaction.id, merchantReference: transaction.merchantReference, status: result.status });
    }

    return NextResponse.json({ success: true, processed: updated.length, updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Reconciliation failed' },
      { status: 500 }
    );
  }
}
