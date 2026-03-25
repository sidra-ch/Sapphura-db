import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';
import { extractStatus, isWebhookTimestampFresh, verifyCallbackSignature } from '../../../../../lib/payments';
import { isPaymentTransactionTableMissing } from '../../../../../lib/payment-transaction-utils';
import { getOrderConfirmationEmail, sendEmail } from '../../../../../lib/email';

type CallbackPayload = Record<string, unknown>;

type StockPlanEntry = {
  productId: number;
  variantId: number | null;
  quantity: number;
};

function parseStockPlan(notes: string | null | undefined): StockPlanEntry[] {
  const rawPlan = String(notes || '')
    .split(' | ')
    .find((entry) => entry.startsWith('stock_plan:'));

  if (!rawPlan) {
    return [];
  }

  const serializedEntries = rawPlan.slice('stock_plan:'.length).trim();
  if (!serializedEntries) {
    return [];
  }

  return serializedEntries
    .split(',')
    .map((entry) => entry.split(':'))
    .map(([productId, variantId, quantity]) => ({
      productId: Number(productId),
      variantId: variantId ? Number(variantId) : null,
      quantity: Number(quantity),
    }))
    .filter((entry) => Number.isInteger(entry.productId) && entry.productId > 0 && Number.isInteger(entry.quantity) && entry.quantity > 0);
}

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
      timestampFresh && verifyCallbackSignature('easypaisa', rawBody, signature, signatureTimestamp);

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
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: transaction.orderId },
          select: { id: true, notes: true, paymentStatus: true },
        });

        if (status === 'paid' && order && order.paymentStatus !== 'paid') {
          const stockPlan = parseStockPlan(order.notes);

          for (const entry of stockPlan) {
            if (entry.variantId) {
              await tx.productVariant.update({
                where: { id: entry.variantId },
                data: { stock: { decrement: entry.quantity } },
              });
            }

            await tx.product.update({
              where: { id: entry.productId },
              data: { stock: { decrement: entry.quantity } },
            });
          }
        }

        await tx.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status,
            callbackPayload: payload as any,
            signatureValid,
            reconciledAt: new Date(),
            providerTransactionId: String(payload.transactionId || transaction.providerTransactionId || '' ) || null,
          },
        });

        await tx.order.update({
          where: { id: transaction.orderId },
          data: orderState,
        });
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ success: true, ignored: true, reason: 'payment_transactions_unavailable' });
      }

      throw error;
    }

    if (status === 'paid') {
      const order = await prisma.order.findUnique({
        where: { id: transaction.orderId },
        include: {
          user: { select: { email: true, name: true } },
          items: { include: { product: true } },
        },
      });

      const customerEmail = order?.user?.email || '';
      if (order && customerEmail && !customerEmail.endsWith('@otp.local')) {
        try {
          await sendEmail({
            to: customerEmail,
            subject: `Sapphura Order Confirmation #${order.id}`,
            html: getOrderConfirmationEmail({
              orderId: String(order.id),
              customerName: order.shippingName || order.user?.name || 'Customer',
              total: order.total,
              items: order.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.price,
              })),
              shippingAddress: order.shippingAddress || '',
            }),
          });
        } catch (error) {
          console.error('Easypaisa confirmation email error:', error);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Easypaisa webhook failed' },
      { status: 500 }
    );
  }
}
