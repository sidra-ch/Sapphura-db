import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { getPrimaryMedia } from '../../../lib/media';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || searchParams.get('query') || '').trim();
    const category = (searchParams.get('category') || '').trim();
    const tags = (searchParams.get('tags') || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!query && !category && tags.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { slug: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(category
          ? {
              category: { name: { equals: category, mode: 'insensitive' } },
            }
          : {}),
        ...(tags.length
          ? {
              tags: {
                some: {
                  tag: {
                    OR: tags.map((tag) => ({
                      name: { equals: tag, mode: 'insensitive' },
                    })),
                  },
                },
              },
            }
          : {}),
      },
      include: {
        category: true,
      },
      take: 12,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      products: products.map((product) => ({
        id: String(product.id),
        name: product.name,
        slug: product.slug,
        price: product.price,
        category: product.category?.name || 'Uncategorized',
        image: getPrimaryMedia(product.images),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search products' },
      { status: 500 }
    );
  }
}
