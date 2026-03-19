import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';
import { extractStatus, isWebhookTimestampFresh, verifyCallbackSignature } from '../../../../../lib/payments';
import { isPaymentTransactionTableMissing } from '../../../../../lib/payment-transaction-utils';

type CallbackPayload = Record<string, unknown>;

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
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');
    const signatureTimestamp = req.headers.get('x-signature-timestamp') || req.headers.get('x-timestamp');
    const timestampFresh = isWebhookTimestampFresh(signatureTimestamp);
    const signatureValid =
      timestampFresh && verifyCallbackSignature('jazzcash', rawBody, signature, signatureTimestamp);

    if (!signatureValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = (JSON.parse(rawBody || '{}') as CallbackPayload);
    const merchantReference = String(payload.merchantReference || payload.orderReference || payload.billReference || '');

    if (!merchantReference) {
      return NextResponse.json({ error: 'merchantReference is missing' }, { status: 400 });
    }

    let transaction;

    try {
      transaction = await prisma.paymentTransaction.findUnique({ where: { merchantReference } });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ success: true, ignored: true, reason: 'payment_transactions_unavailable' });
      }

      throw error;
    }
    if (!transaction) {
      return NextResponse.json({ error: 'Payment transaction not found' }, { status: 404 });
    }

    if (transaction.status === 'paid') {
      return NextResponse.json({ success: true, idempotent: true, status: 'paid' });
    }

    const status = extractStatus(payload);

    if (transaction.status === status && transaction.reconciledAt) {
      return NextResponse.json({ success: true, idempotent: true, status });
    }

    const orderState = mapOrderState(status);

    try {
      await prisma.$transaction([
        prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status,
            callbackPayload: payload as any,
            signatureValid,
            reconciledAt: new Date(),
            providerTransactionId: String(payload.transactionId || transaction.providerTransactionId || '' ) || null,
          },
        }),
        prisma.order.update({
          where: { id: transaction.orderId },
          data: orderState,
        }),
      ]);
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ success: true, ignored: true, reason: 'payment_transactions_unavailable' });
      }

      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'JazzCash webhook failed' },
      { status: 500 }
    );
  }
}
