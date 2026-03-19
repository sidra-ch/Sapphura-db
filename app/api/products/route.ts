import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/db';
import { getPrimaryMedia, parseMediaList } from '../../../lib/media';
import { requireClerkRole } from '../../../lib/clerk-rbac';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get('featured') === '1';
    const limit = Number(searchParams.get('limit') || '0');

    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        ...(featuredOnly ? { isFeatured: true } : {}),
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      ...(Number.isFinite(limit) && limit > 0 ? { take: limit } : {}),
    });

    return NextResponse.json({
      products: products.map((p: any) => ({
        id: p.publicId || String(p.id),
        legacyId: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock,
        status: p.status,
        isFeatured: p.isFeatured,
        category: p.category?.name || '',
        categoryId: p.categoryId,
        images: parseMediaList(p.images),
        image: getPrimaryMedia(p.images),
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireClerkRole('admin');
    if (guard) {
      return guard;
    }

    const body = await req.json();
    const name = String(body.name || '').trim();
    const description = String(body.description || '').trim();
    const price = Number(body.price);
    const stock = Number(body.stock || 0);
    const categoryId = Number(body.categoryId);
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((url: unknown) => typeof url === 'string' && String(url).trim())
      : [];
    const videoUrls = Array.isArray(body.videoUrls)
      ? body.videoUrls.filter((url: unknown) => typeof url === 'string' && String(url).trim())
      : [];
    const salePrice = body.salePrice ? Number(body.salePrice) : null;
    const isFeatured = Boolean(body.isFeatured);

    if (!name || !description || !Number.isFinite(price) || price <= 0 || !Number.isFinite(categoryId) || categoryId <= 0) {
      return NextResponse.json({ error: 'name, description, price, and categoryId are required' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const slug = `${baseSlug}-${Date.now()}`;

    const images = [...imageUrls, ...videoUrls];

    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice,
        stock: Number.isFinite(stock) ? stock : 0,
        categoryId,
        isFeatured,
        status: 'active',
        images: JSON.stringify(images),
      },
      include: { category: true },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: created.publicId || String(created.id),
        legacyId: created.id,
        name: created.name,
        slug: created.slug,
        image: getPrimaryMedia(created.images),
        images: parseMediaList(created.images),
        category: created.category.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}
