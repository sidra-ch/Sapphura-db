import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';
import prisma from '../../../lib/db';
import { hashPassword, verifyOtpProofToken } from '../../../lib/auth';
import { normalizeShippingAddress } from '../../../lib/address';
import { getOrderConfirmationEmail, sendEmail } from '../../../lib/email';
import { evaluateCheckoutRisk } from '../../../lib/payment-risk';
import { checkRateLimit } from '../../../lib/rate-limit';
import { getClientIp } from '../../../lib/request';
import { normalizeEmail } from '../../../lib/request';
import { requireClerkRole } from '../../../lib/clerk-rbac';
import { getOrCreatePrismaUser } from '../../../lib/prismaUser';
import { calculateOrderTotal, calculateShippingCost, resolveCheckoutOffer } from '../../../lib/checkout-offers';

interface OrderPayloadItem {
  id: string;
  productId?: string;
  variantId?: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderPayload {
  email?: string;
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
  couponCode?: string;
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

function normalizePhoneForIdentity(phone: string): string {
  return phone.replace(/\D/g, '');
}

function deriveCheckoutIdentityEmail(email: string | undefined, phone: string): string {
  const normalizedEmail = normalizeEmail(String(email || ''));
  if (normalizedEmail) return normalizedEmail;
  const digits = normalizePhoneForIdentity(String(phone || ''));
  return digits ? `phone-${digits}@otp.local` : '';
}

function isPaymentTransactionTableMissing(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || '');
  return message.includes('PaymentTransaction') && message.toLowerCase().includes('does not exist');
}

async function findProductByItemId(itemId: string) {
  const numericId = Number(itemId)
  if (Number.isInteger(numericId) && numericId > 0) {
    const byNumeric = await prisma.product.findUnique({ where: { id: numericId }, include: { variants: true } })
    if (byNumeric) return byNumeric
  }

  const byPublicId = await prisma.product.findUnique({ where: { publicId: itemId }, include: { variants: true } })
  if (byPublicId) return byPublicId

  return prisma.product.findUnique({ where: { slug: itemId }, include: { variants: true } })
}

type StockPlanEntry = {
  productId: number;
  variantId: number | null;
  quantity: number;
};

function serializeStockPlan(entries: StockPlanEntry[]): string {
  return `stock_plan:${entries.map((entry) => [entry.productId, entry.variantId ?? '', entry.quantity].join(':')).join(',')}`;
}

export async function GET(req: NextRequest) {
  const guard = await requireClerkRole('admin');
  if (guard) {
    return guard;
  }

  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      user: {
        select: {
          id: true,
          publicId: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({
    orders: orders.map((order) => ({
      ...order,
      id: order.publicId || String(order.id),
      legacyId: order.id,
      user: order.user
        ? {
            ...order.user,
            id: order.user.publicId || String(order.user.id),
            legacyId: order.user.id,
          }
        : null,
      items: Array.isArray(order.items)
        ? order.items.map((item) => ({
            ...item,
            product: item.product
              ? {
                  ...item.product,
                  id: item.product.publicId || String(item.product.id),
                  legacyId: item.product.id,
                }
              : null,
          }))
        : [],
    })),
  });
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
      subtotal,
      shippingCost,
      couponCode,
      discount,
      total,
      paymentVerification,
    } = body;

    const normalizedEmail = deriveCheckoutIdentityEmail(email, phone);
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

      let existingIntentUse: { id: number } | null = null;
      try {
        existingIntentUse = await prisma.paymentTransaction.findFirst({
          where: {
            provider: 'stripe',
            providerTransactionId: paymentIntentId,
          },
          select: { id: true },
        });
      } catch (error) {
        if (!isPaymentTransactionTableMissing(error)) {
          throw error;
        }
      }

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

      const receiptEmail = paymentIntent.receipt_email
        ? deriveCheckoutIdentityEmail(paymentIntent.receipt_email, phone)
        : '';

      if (receiptEmail && receiptEmail !== normalizedEmail) {
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

    const shouldReserveStockImmediately = paymentMethod === 'card' || paymentMethod === 'cod';
    const shouldSendConfirmationEmail = paymentMethod === 'card' || paymentMethod === 'cod';
    const productsForOrder = [] as Array<{ productId: number; variantId: number | null; quantity: number; price: number; name: string }>;

    for (const item of items) {
      if (!item?.id || !item?.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Invalid order items' }, { status: 400 });
      }

      const productIdentity = String(item.productId || item.id);
      const product = await findProductByItemId(productIdentity);

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name || item.id}` }, { status: 404 });
      }

      const requestedVariantId = Number(item.variantId);
      const matchedVariant = Number.isInteger(requestedVariantId) && requestedVariantId > 0
        ? product.variants.find((variant) => variant.id === requestedVariantId) || null
        : null;

      if (item.variantId && !matchedVariant) {
        return NextResponse.json({ error: `Selected variant is no longer available for ${product.name}` }, { status: 400 });
      }

      const availableStock = matchedVariant ? matchedVariant.stock : product.stock;
      if (availableStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Available: ${availableStock}` },
          { status: 400 }
        );
      }

      productsForOrder.push({
        productId: product.id,
        variantId: matchedVariant?.id ?? null,
        quantity: item.quantity,
        price: matchedVariant?.price ?? product.salePrice ?? product.price,
        name: product.name,
      });
    }

    const computedSubtotal = productsForOrder.reduce((sum, entry) => sum + (entry.price * entry.quantity), 0)
    const computedShippingCost = calculateShippingCost(shippingMethod)
    const offer = resolveCheckoutOffer(couponCode, computedSubtotal)
    const computedTotal = calculateOrderTotal(computedSubtotal, computedShippingCost, offer.discount)

    if (Math.abs(Number(subtotal) - computedSubtotal) > 0.01) {
      return NextResponse.json({ error: 'Order subtotal no longer matches current product prices. Please review your cart again.' }, { status: 400 })
    }

    if (Math.abs(Number(shippingCost) - computedShippingCost) > 0.01) {
      return NextResponse.json({ error: 'Shipping cost no longer matches the selected shipping method. Please review checkout again.' }, { status: 400 })
    }

    if (Math.abs(Number(discount) - offer.discount) > 0.01) {
      return NextResponse.json({ error: offer.error || 'Discount no longer matches the selected offer. Please reapply your coupon.' }, { status: 400 })
    }

    if (Math.abs(Number(total) - computedTotal) > 0.01) {
      return NextResponse.json({ error: 'Order total mismatch. Please review checkout again before paying.' }, { status: 400 })
    }

    const authState = await auth();
    let user: { id: number; email: string; name?: string | null; phone?: string | null };

    if (authState.userId) {
      const clerkUser = await getOrCreatePrismaUser();
      user = await prisma.user.update({
        where: { id: clerkUser.id },
        data: {
          name: `${firstName} ${lastName}`.trim(),
          phone,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      });
    } else {
      user = await prisma.user.upsert({
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
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      });
    }

    const created = await prisma.$transaction(async (tx: any) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          total: computedTotal,
          discount: offer.discount,
          shippingCost: computedShippingCost,
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
            offer.couponCode ? `coupon:${offer.couponCode}` : null,
            `risk:${riskResult.level}:${riskResult.score}`,
            riskResult.flags.length ? `risk_flags:${riskResult.flags.join('|')}` : null,
            serializeStockPlan(productsForOrder),
          ]
            .filter(Boolean)
            .join(' | '),
        },
      });

      await tx.orderItem.createMany({
        data: productsForOrder.map((entry: any) => ({
          orderId: order.id,
          productId: entry.productId,
          quantity: entry.quantity,
          price: entry.price,
        })),
      });

      if (shouldReserveStockImmediately) {
        for (const entry of productsForOrder) {
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

      const orderWithItems = await tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: { include: { product: true } },
          user: true,
        },
      });

      return orderWithItems;
    });

    if (paymentMethod === 'card') {
      try {
        await prisma.paymentTransaction.create({
          data: {
            orderId: created.id,
            provider: 'stripe',
            merchantReference: `STRIPE-${created.id}-${Date.now()}`,
            providerTransactionId: paymentVerification?.stripePaymentIntentId || null,
            amount: computedTotal,
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
      } catch (error) {
        if (!isPaymentTransactionTableMissing(error)) {
          throw error;
        }
      }
    }

    if (!created) {
      return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
    }

    let confirmationEmailSent = false;
    let confirmationEmailError: string | null = null;

    if (shouldSendConfirmationEmail) {
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
        id: created.publicId || String(created.id),
        legacyId: created.id,
        total: created.total,
        status: created.status,
        paymentStatus: created.paymentStatus,
        shippingName: created.shippingName,
        shippingPhone: created.shippingPhone,
        shippingAddress: created.shippingAddress,
        items: created.items.map((entry: any) => ({
          id: entry.product?.publicId || String(entry.productId),
          legacyId: entry.productId,
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
