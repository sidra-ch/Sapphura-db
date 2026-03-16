import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../lib/db';
import { hashPassword, verifyOtpProofToken } from '../../../lib/auth';
import { normalizeShippingAddress } from '../../../lib/address';
import { getOrderConfirmationEmail, sendEmail } from '../../../lib/email';
import { evaluateCheckoutRisk } from '../../../lib/payment-risk';
import { checkRateLimit } from '../../../lib/rate-limit';
import { getClientIp } from '../../../lib/request';
import { normalizeEmail } from '../../../lib/request';

interface OrderPayloadItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country?: string;
  postalCode?: string;
  shippingMethod?: string;
  paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa';
  items: OrderPayloadItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentVerification?: {
    otpVerificationToken?: string;
    otpVerifiedAt?: string;
    stripePaymentIntentId?: string;
    cardAuthorizedAt?: string;
    walletNumberMasked?: string;
    walletAccountTitle?: string;
    walletTransactionReference?: string;
  };
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const requestLimit = checkRateLimit({ key: `orders:create:${ip}`, max: 20, windowMs: 60_000 });
    if (!requestLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please wait before retrying.' },
        { status: 429, headers: { 'Retry-After': String(requestLimit.retryAfterSeconds) } }
      );
    }

    const body = (await req.json()) as OrderPayload;
    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      country,
      postalCode,
      shippingMethod,
      paymentMethod,
      items,
      shippingCost,
      discount,
      total,
      paymentVerification,
    } = body;

    const normalizedEmail = normalizeEmail(String(email || ''));
    const normalizedAddress = normalizeShippingAddress({
      address,
      city,
      country,
      postalCode,
    });

    if (!normalizedEmail || !firstName || !lastName || !phone || !address || !city) {
      return NextResponse.json({ error: 'Shipping details are required' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!paymentVerification?.otpVerificationToken) {
      return NextResponse.json({ error: 'Missing payment verification token' }, { status: 400 });
    }

    const otpProof = verifyOtpProofToken(paymentVerification.otpVerificationToken);
    const expectedPurpose = `payment-${paymentMethod}`;
    if (!otpProof || otpProof.email !== normalizedEmail || otpProof.purpose !== `payment:${expectedPurpose}`) {
      return NextResponse.json({ error: 'Invalid payment OTP verification proof' }, { status: 400 });
    }

    if (paymentMethod === 'card') {
      const paymentIntentId = paymentVerification?.stripePaymentIntentId?.trim();
      if (!paymentIntentId) {
        return NextResponse.json({ error: 'Stripe payment authorization is required' }, { status: 400 });
      }
      if (!stripe) {
        return NextResponse.json({ error: 'Stripe is not configured on server' }, { status: 500 });
      }

      const existingIntentUse = await prisma.paymentTransaction.findFirst({
        where: {
          provider: 'stripe',
          providerTransactionId: paymentIntentId,
        },
      });

      if (existingIntentUse) {
        return NextResponse.json({ error: 'Payment authorization has already been used' }, { status: 409 });
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json({ error: 'Payment authorization is not completed' }, { status: 400 });
      }

      const expectedAmount = Math.round(Number(total) * 100);
      if (paymentIntent.amount_received !== expectedAmount) {
        return NextResponse.json(
          { error: 'Authorized amount does not match order total. Please retry payment.' },
          { status: 400 }
        );
      }

      if (paymentIntent.receipt_email && normalizeEmail(paymentIntent.receipt_email) !== normalizedEmail) {
        return NextResponse.json({ error: 'Payment authorization identity mismatch' }, { status: 400 });
      }
    }

    const riskResult = await evaluateCheckoutRisk({
      email: normalizedEmail,
      phone,
      ip,
      paymentMethod,
      total: Number(total),
      itemCount: items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
      otpVerifiedAt: paymentVerification.otpVerifiedAt,
      cardAuthorizedAt: paymentVerification.cardAuthorizedAt,
    });

    if (riskResult.level === 'high') {
      return NextResponse.json(
        {
          error: 'This payment requires manual review. Please contact support to proceed.',
          risk: {
            score: riskResult.score,
            level: riskResult.level,
            flags: riskResult.flags,
          },
        },
        { status: 403 }
      );
    }

    const productsForOrder = [] as Array<{ productId: number; quantity: number; price: number; name: string }>;

    for (const item of items) {
      if (!item?.id || !item?.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
      }

      const numericId = Number(item.id);
      const product = Number.isInteger(numericId)
        ? await prisma.product.findUnique({ where: { id: numericId } })
        : await prisma.product.findUnique({ where: { slug: item.id } });

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name || item.id}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        );
      }

      productsForOrder.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.salePrice ?? product.price,
        name: product.name,
      });
    }

    const user = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: `${firstName} ${lastName}`.trim(),
        phone,
      },
      create: {
        email: normalizedEmail,
        password: await hashPassword(`guest-${Date.now()}-${Math.random()}`),
        name: `${firstName} ${lastName}`.trim(),
        phone,
        role: 'customer',
      },
    });

    const created = await prisma.$transaction(async (tx: any) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          total,
          discount,
          shippingCost,
          status: paymentMethod === 'card' ? 'paid' : 'pending',
          paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
          paymentMethod:
            paymentMethod === 'card'
              ? 'stripe'
              : paymentMethod === 'jazzcash'
              ? 'jazzcash'
              : paymentMethod === 'easypaisa'
              ? 'easypaisa'
              : 'cod',
          shippingName: `${firstName} ${lastName}`.trim(),
          shippingPhone: phone,
          shippingAddress: normalizedAddress.fullAddress,
          notes: [
            shippingMethod || null,
            `risk:${riskResult.level}:${riskResult.score}`,
            riskResult.flags.length ? `risk_flags:${riskResult.flags.join('|')}` : null,
          ]
            .filter(Boolean)
            .join(' | '),
        },
      });

      if (paymentMethod === 'card') {
        await tx.paymentTransaction.create({
          data: {
            orderId: order.id,
            provider: 'stripe',
            merchantReference: `STRIPE-${order.id}-${Date.now()}`,
            providerTransactionId: paymentVerification?.stripePaymentIntentId || null,
            amount: Number(total),
            currency: 'USD',
            status: 'paid',
            requestPayload: {
              otpVerifiedAt: paymentVerification?.otpVerifiedAt || null,
              cardAuthorizedAt: paymentVerification?.cardAuthorizedAt || null,
            },
            responsePayload: {
              paymentIntentId: paymentVerification?.stripePaymentIntentId || null,
            },
            signatureValid: true,
            reconciledAt: new Date(),
          },
        });
      }

      await tx.orderItem.createMany({
        data: productsForOrder.map((entry: any) => ({
          orderId: order.id,
          productId: entry.productId,
          quantity: entry.quantity,
          price: entry.price,
        })),
      });

      for (const entry of productsForOrder) {
        await tx.product.update({
          where: { id: entry.productId },
          data: { stock: { decrement: entry.quantity } },
        });
      }

      const orderWithItems = await tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: { include: { product: true } },
          user: true,
        },
      });

      return orderWithItems;
    });

    if (!created) {
      return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
    }

    let confirmationEmailSent = false;
    let confirmationEmailError: string | null = null;

    try {
      await sendEmail({
        to: normalizedEmail,
        subject: `Sapphura Order Confirmation #${created.id}`,
        html: getOrderConfirmationEmail({
          orderId: String(created.id),
          customerName: created.shippingName || `${firstName} ${lastName}`,
          total,
          items: created.items.map((i: any) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingAddress: created.shippingAddress || normalizedAddress.fullAddress,
        }),
      });
      confirmationEmailSent = true;
    } catch (error) {
      confirmationEmailError = error instanceof Error ? error.message : 'Failed to send order confirmation email';
      console.error('Order confirmation email error:', confirmationEmailError);
    }

    return NextResponse.json({
      success: true,
      risk: {
        score: riskResult.score,
        level: riskResult.level,
        flags: riskResult.flags,
        externalProviderUsed: riskResult.externalProviderUsed,
      },
      confirmationEmailSent,
      confirmationEmailError,
      order: {
        id: created.id,
        total: created.total,
        status: created.status,
        paymentStatus: created.paymentStatus,
        shippingName: created.shippingName,
        shippingPhone: created.shippingPhone,
        shippingAddress: created.shippingAddress,
        items: created.items.map((entry: any) => ({
          id: String(entry.productId),
          name: entry.product.name,
          price: entry.price,
          quantity: entry.quantity,
          image: (() => {
            try {
              const parsed = JSON.parse(entry.product.images || '[]');
              return Array.isArray(parsed) && parsed.length > 0 ? String(parsed[0]) : '';
            } catch {
              return '';
            }
          })(),
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
