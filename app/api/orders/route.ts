import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { hashPassword } from '../../../lib/auth';
import { getOrderConfirmationEmail, sendEmail } from '../../../lib/email';

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
}

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
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
    } = body;

    if (!email || !firstName || !lastName || !phone || !address || !city) {
      return NextResponse.json({ error: 'Shipping details are required' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
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
      where: { email },
      update: {
        name: `${firstName} ${lastName}`.trim(),
        phone,
      },
      create: {
        email,
        password: await hashPassword(`guest-${Date.now()}-${Math.random()}`),
        name: `${firstName} ${lastName}`.trim(),
        phone,
        role: 'customer',
      },
    });

    const created = await prisma.$transaction(async (tx) => {
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
          shippingAddress: `${address}, ${city}${country ? `, ${country}` : ''}${postalCode ? ` ${postalCode}` : ''}`,
          notes: shippingMethod || null,
        },
      });

      await tx.orderItem.createMany({
        data: productsForOrder.map((entry) => ({
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
        to: email.trim().toLowerCase(),
        subject: `Sapphura Order Confirmation #${created.id}`,
        html: getOrderConfirmationEmail({
          orderId: String(created.id),
          customerName: created.shippingName || `${firstName} ${lastName}`,
          total,
          items: created.items.map((i) => ({
            name: i.product.name,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingAddress: created.shippingAddress || `${address}, ${city}`,
        }),
      });
      confirmationEmailSent = true;
    } catch (error) {
      confirmationEmailError = error instanceof Error ? error.message : 'Failed to send order confirmation email';
      console.error('Order confirmation email error:', confirmationEmailError);
    }

    return NextResponse.json({
      success: true,
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
        items: created.items.map((entry) => ({
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
