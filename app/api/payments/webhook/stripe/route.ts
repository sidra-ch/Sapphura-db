import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';
import { isPaymentTransactionTableMissing } from '../../../../../lib/payment-transaction-utils';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

function mapOrderState(status: 'paid' | 'failed' | 'pending') {
  if (status === 'paid') {
    return { paymentStatus: 'paid', status: 'paid' };
  }
  if (status === 'failed') {
    return { paymentStatus: 'failed', status: 'pending' };
  }
  return { paymentStatus: 'pending', status: 'pending' };
}

function mapStripeIntentStatus(status: string): 'paid' | 'failed' | 'pending' {
  if (status === 'succeeded') return 'paid';
  if (status === 'canceled' || status === 'requires_payment_method') return 'failed';
  return 'pending';
}

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' }, { status: 500 });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const rawBody = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    if (!['payment_intent.succeeded', 'payment_intent.payment_failed', 'payment_intent.canceled'].includes(event.type)) {
      return NextResponse.json({ success: true, ignored: true, eventType: event.type });
    }

    const intent = event.data.object as Stripe.PaymentIntent;
    const providerStatus = mapStripeIntentStatus(intent.status);

    let transaction;

    try {
      transaction = await prisma.paymentTransaction.findFirst({
        where: {
          provider: 'stripe',
          providerTransactionId: intent.id,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ success: true, ignored: true, reason: 'payment_transactions_unavailable' });
      }

      throw error;
    }

    if (!transaction) {
      return NextResponse.json({ success: true, ignored: true, reason: 'transaction_not_found' });
    }

    if (transaction.status === providerStatus && transaction.reconciledAt) {
      return NextResponse.json({ success: true, idempotent: true, status: providerStatus });
    }

    const orderState = mapOrderState(providerStatus);

    try {
      await prisma.$transaction([
        prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: providerStatus,
            callbackPayload: {
              eventId: event.id,
              eventType: event.type,
              paymentIntentId: intent.id,
              paymentIntentStatus: intent.status,
            },
            responsePayload: intent as unknown as object,
            signatureValid: true,
            reconciledAt: new Date(),
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

    return NextResponse.json({ success: true, status: providerStatus });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Stripe webhook handling failed' },
      { status: 500 }
    );
  }
}
