import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { getPaymentProviderConfig, initiateProviderPayment } from '../../../../lib/payments';
import { isPaymentTransactionTableMissing, PAYMENT_TRANSACTION_SETUP_MESSAGE } from '../../../../lib/payment-transaction-utils';
import { checkRateLimit } from '../../../../lib/rate-limit';
import { getClientIp, normalizeEmail } from '../../../../lib/request';

function generateMerchantReference(provider: 'jazzcash' | 'easypaisa', orderId: number): string {
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${provider.toUpperCase()}-${orderId}-${Date.now()}-${suffix}`;
}

function getPaymentUrl(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const candidate = (raw as Record<string, unknown>).paymentUrl || (raw as Record<string, unknown>).redirectUrl;
  return typeof candidate === 'string' && candidate ? candidate : null;
}

function buildReturnUrl(appUrl: string, order: { id: number; publicId: string | null }, provider: 'jazzcash' | 'easypaisa') {
  const params = new URLSearchParams({
    order: order.publicId || String(order.id),
    lookup: String(order.id),
    provider,
    state: 'pending_payment',
  });

  return `${appUrl}/order-confirmation?${params.toString()}`;
}

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

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit({ key: `pay:init:${ip}`, max: 20, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many payment initiation requests. Please retry shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      );
    }

    const body = await req.json();
    const provider = body.provider as 'jazzcash' | 'easypaisa';
    const orderIdentifier = String(body.orderId || '').trim();
    const amount = Number(body.amount);
    const email = normalizeEmail(String(body.email || ''));
    const phone = String(body.phone || '').trim();

    if (!provider || !['jazzcash', 'easypaisa'].includes(provider)) {
      return NextResponse.json({ error: 'Unsupported payment provider' }, { status: 400 });
    }

    const providerConfig = getPaymentProviderConfig(provider);
    if (!providerConfig.available) {
      return NextResponse.json(
        {
          error: `${provider.toUpperCase()} is not available right now`,
          missingConfiguration: providerConfig.missing,
        },
        { status: 503 }
      );
    }

    if (!orderIdentifier) {
      return NextResponse.json({ error: 'Valid orderId is required' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }
    if (!email || !phone) {
      return NextResponse.json({ error: 'Email and phone are required' }, { status: 400 });
    }

    const order = await findOrderByIdentifier(orderIdentifier);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (Math.abs(Number(order.total) - amount) > 0.01) {
      return NextResponse.json({ error: 'Payment amount no longer matches the order total' }, { status: 400 });
    }

    let existing = null;

    try {
      existing = await prisma.paymentTransaction.findFirst({
        where: {
          orderId: order.id,
          provider,
          status: { in: ['initiated', 'pending'] },
          createdAt: { gte: new Date(Date.now() - 20 * 60_000) },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ error: PAYMENT_TRANSACTION_SETUP_MESSAGE }, { status: 503 });
      }

      throw error;
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        transaction: {
          id: existing.id,
          merchantReference: existing.merchantReference,
          provider: existing.provider,
          status: existing.status,
          paymentUrl: getPaymentUrl(existing.responsePayload),
          reused: true,
        },
      });
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: 'APP_URL is not configured' }, { status: 500 });
    }

    const merchantReference = generateMerchantReference(provider, order.id);
    const callbackUrl = `${appUrl}/api/payments/webhook/${provider}`;
    const returnUrl = buildReturnUrl(appUrl, order, provider);

    let tx;

    try {
      tx = await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          provider,
          merchantReference,
          amount,
          status: 'initiated',
          requestPayload: {
            provider,
            amount,
            email,
            phone,
            callbackUrl,
            returnUrl,
          },
        },
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ error: PAYMENT_TRANSACTION_SETUP_MESSAGE }, { status: 503 });
      }

      throw error;
    }

    const providerResult = await initiateProviderPayment(provider, {
      amount,
      email,
      phone,
      merchantReference,
      callbackUrl,
      returnUrl,
    });

    try {
      await prisma.paymentTransaction.update({
        where: { id: tx.id },
        data: {
          providerTransactionId: providerResult.providerTransactionId || null,
          status: providerResult.status,
          responsePayload: providerResult.raw as object,
        },
      });
    } catch (error) {
      if (isPaymentTransactionTableMissing(error)) {
        return NextResponse.json({ error: PAYMENT_TRANSACTION_SETUP_MESSAGE }, { status: 503 });
      }

      throw error;
    }

    return NextResponse.json({
      success: providerResult.status !== 'failed',
      transaction: {
        id: tx.id,
        merchantReference,
        provider,
        status: providerResult.status,
        paymentUrl: providerResult.paymentUrl || null,
        returnUrl,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('is not configured')) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
