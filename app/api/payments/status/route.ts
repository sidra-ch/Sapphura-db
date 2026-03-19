import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { isPaymentTransactionTableMissing, PAYMENT_TRANSACTION_SETUP_MESSAGE } from '../../../../lib/payment-transaction-utils';

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get('x-payment-debug-key');
  const expected = process.env.PAYMENT_DEBUG_KEY || process.env.PAYMENT_RECONCILE_KEY;
  return Boolean(expected && key && key === expected);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const merchantReference = searchParams.get('merchantReference')?.trim() || '';
    const provider = searchParams.get('provider')?.trim() || '';
    const orderId = Number(searchParams.get('orderId') || '0');

    const where: {
      merchantReference?: string;
      provider?: string;
      orderId?: number;
    } = {};

    if (merchantReference) {
      where.merchantReference = merchantReference;
    }
    if (provider) {
      where.provider = provider;
    }
    if (Number.isFinite(orderId) && orderId > 0) {
      where.orderId = orderId;
    }

    let transactions = [];

    try {
      transactions = await prisma.paymentTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          orderId: true,
          provider: true,
          merchantReference: true,
          providerTransactionId: true,
          amount: true,
          currency: true,
          status: true,
          signatureValid: true,
          reconciledAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ success: true, count: 0, transactions: [], warning: PAYMENT_TRANSACTION_SETUP_MESSAGE });
      }

      throw error;
    }

    return NextResponse.json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch payment status' },
      { status: 500 }
    );
  }
}
