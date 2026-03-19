import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

function getStripeClient(): Stripe | null {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return null;
  }
  return new Stripe(secret);
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured on server' }, { status: 500 });
    }

    const { amount, currency = 'usd', email, items, orderFingerprint } = await req.json();

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    const amountInMinorUnit = Math.round(amount * 100);
    if (amountInMinorUnit < 50) {
      return NextResponse.json({ error: 'Minimum charge amount is too low' }, { status: 400 });
    }

    const idempotencyKey = typeof orderFingerprint === 'string' && orderFingerprint.trim().length > 0
      ? `stripe-intent-${orderFingerprint.trim()}`
      : undefined;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInMinorUnit,
        currency,
        automatic_payment_methods: { enabled: true },
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic',
          },
        },
        metadata: {
          email: email || '',
          items: JSON.stringify(items || []),
        },
        receipt_email: email || undefined,
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentIntentId = searchParams.get('id');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Payment intent ID required' }, { status: 400 });
  }

  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured on server' }, { status: 500 });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error' }, { status: 500 });
  }
}