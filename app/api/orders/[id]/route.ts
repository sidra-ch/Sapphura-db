import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { requireClerkRole } from '../../../../lib/clerk-rbac';

type Params = {
  params: Promise<{ id: string }>;
};

async function findOrderIdByParam(idParam: string): Promise<number | null> {
  const numericId = Number(idParam)
  if (Number.isInteger(numericId) && numericId > 0) {
    return numericId
  }

  const byPublicId = await (prisma.order as any).findUnique({
    where: { publicId: idParam },
    select: { id: true },
  })

  if (byPublicId?.id) {
    return byPublicId.id
  }

  return null
}

const ORDER_STATUSES = new Set(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'paid']);
const PAYMENT_STATUSES = new Set(['pending', 'paid', 'failed', 'refunded']);

export async function PATCH(req: NextRequest, context: Params) {
  try {
    const guard = await requireClerkRole('admin');
    if (guard) {
      return guard;
    }

    const { id } = await context.params;
    const orderId = await findOrderIdByParam(id);
    if (!orderId) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const body = await req.json();
    const status = body.status ? String(body.status).trim().toLowerCase() : undefined;
    const paymentStatus = body.paymentStatus ? String(body.paymentStatus).trim().toLowerCase() : undefined;

    if (!status && !paymentStatus) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    if (status && !ORDER_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    if (paymentStatus && !PAYMENT_STATUSES.has(paymentStatus)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
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
    });
    const updatedAny = updated as any;

    return NextResponse.json({
      success: true,
      order: {
        ...updatedAny,
        id: updatedAny.publicId || String(updatedAny.id),
        legacyId: updatedAny.id,
        user: updatedAny.user
          ? {
              ...updatedAny.user,
              id: updatedAny.user.publicId || String(updatedAny.user.id),
              legacyId: updatedAny.user.id,
            }
          : null,
        items: Array.isArray(updatedAny.items)
          ? updatedAny.items.map((item: any) => ({
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
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update order' },
      { status: 500 }
    );
  }
}
