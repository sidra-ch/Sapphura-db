import { NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { getPrimaryMedia } from '../../../lib/media';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          select: { images: true },
          where: { status: 'active' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        products: c._count.products,
        image: getPrimaryMedia(c.products[0]?.images),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
