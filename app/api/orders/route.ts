import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  await req.json();
  // Add order creation logic here
  return NextResponse.json({ success: true });
}
