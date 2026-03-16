import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { initiateProviderPayment } from '../../../../lib/payments';
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
    const orderId = Number(body.orderId);
    const amount = Number(body.amount);
    const email = normalizeEmail(String(body.email || ''));
    const phone = String(body.phone || '').trim();

    if (!provider || !['jazzcash', 'easypaisa'].includes(provider)) {
      return NextResponse.json({ error: 'Unsupported payment provider' }, { status: 400 });
    }
    if (!orderId || !Number.isFinite(orderId)) {
      return NextResponse.json({ error: 'Valid orderId is required' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }
    if (!email || !phone) {
      return NextResponse.json({ error: 'Email and phone are required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const existing = await prisma.paymentTransaction.findFirst({
      where: {
        orderId,
        provider,
        status: { in: ['initiated', 'pending'] },
        createdAt: { gte: new Date(Date.now() - 20 * 60_000) },
      },
      orderBy: { createdAt: 'desc' },
    });

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

    const merchantReference = generateMerchantReference(provider, orderId);
    const callbackUrl = `${appUrl}/api/payments/webhook/${provider}`;

    const tx = await prisma.paymentTransaction.create({
      data: {
        orderId,
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
        },
      },
    });

    const providerResult = await initiateProviderPayment(provider, {
      amount,
      email,
      phone,
      merchantReference,
      callbackUrl,
    });

    await prisma.paymentTransaction.update({
      where: { id: tx.id },
      data: {
        providerTransactionId: providerResult.providerTransactionId || null,
        status: providerResult.status,
        responsePayload: providerResult.raw as object,
      },
    });

    return NextResponse.json({
      success: providerResult.status !== 'failed',
      transaction: {
        id: tx.id,
        merchantReference,
        provider,
        status: providerResult.status,
        paymentUrl: providerResult.paymentUrl || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
