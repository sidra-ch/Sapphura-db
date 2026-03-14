import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const tags = searchParams.get('tags');

  // Build search conditions
  const where: Record<string, unknown> = {
    name: {
      contains: query,
      mode: 'insensitive',
    },
  };
  if (category) where.category = { name: category };
  if (tags) where.tags = { has: tags };

  const products = await prisma.product.findMany({
    where,
    take: 12,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}
