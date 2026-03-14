import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const take = 12;
  const skip = (page - 1) * take;

  const products = await prisma.product.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}
