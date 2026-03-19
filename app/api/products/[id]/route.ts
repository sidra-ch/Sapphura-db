import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { getPrimaryMedia, parseMediaList } from '../../../../lib/media';
import { requireClerkRole } from '../../../../lib/clerk-rbac';

type Params = {
  params: Promise<{ id: string }>;
};

async function findProductIdByParam(idParam: string): Promise<number | null> {
  const numericId = Number(idParam)
  if (Number.isInteger(numericId) && numericId > 0) {
    return numericId
  }

  const byPublicId = await (prisma.product as any).findUnique({
    where: { publicId: idParam },
    select: { id: true },
  })

  if (byPublicId?.id) {
    return byPublicId.id
  }

  return null
}

function normalizeMediaUrls(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((url: unknown) => typeof url === 'string' && String(url).trim().length > 0)
    .map((url: string) => url.trim());
}

export async function PATCH(req: NextRequest, context: Params) {
  try {
    const guard = await requireClerkRole('admin');
    if (guard) {
      return guard;
    }

    const { id } = await context.params;
    const productId = await findProductIdByParam(id);
    if (!productId) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = String(body.name || '').trim();
      if (!name) {
        return NextResponse.json({ error: 'Product name cannot be empty' }, { status: 400 });
      }
      updates.name = name;
    }

    if (body.description !== undefined) {
      const description = String(body.description || '').trim();
      if (!description) {
        return NextResponse.json({ error: 'Product description cannot be empty' }, { status: 400 });
      }
      updates.description = description;
    }

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json({ error: 'Price must be a valid number greater than zero' }, { status: 400 });
      }
      updates.price = price;
    }

    if (body.salePrice !== undefined) {
      if (body.salePrice === null || body.salePrice === '') {
        updates.salePrice = null;
      } else {
        const salePrice = Number(body.salePrice);
        if (!Number.isFinite(salePrice) || salePrice <= 0) {
          return NextResponse.json({ error: 'Sale price must be a valid number greater than zero' }, { status: 400 });
        }
        updates.salePrice = salePrice;
      }
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json({ error: 'Stock must be a non-negative integer' }, { status: 400 });
      }
      updates.stock = stock;
    }

    if (body.status !== undefined) {
      const status = String(body.status || '').trim().toLowerCase();
      if (!['active', 'inactive', 'draft'].includes(status)) {
        return NextResponse.json({ error: 'Invalid product status' }, { status: 400 });
      }
      updates.status = status;
    }

    if (body.categoryId !== undefined) {
      const categoryId = Number(body.categoryId);
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
      }

      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      updates.categoryId = categoryId;
    }

    if (body.isFeatured !== undefined) {
      updates.isFeatured = Boolean(body.isFeatured);
    }

    const imageUrls = normalizeMediaUrls(body.imageUrls);
    const videoUrls = normalizeMediaUrls(body.videoUrls);
    if (imageUrls.length > 0 || videoUrls.length > 0) {
      updates.images = JSON.stringify([...imageUrls, ...videoUrls]);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: updates,
      include: { category: true },
    });
    const updatedAny = updated as any;

    return NextResponse.json({
      success: true,
      product: {
        id: updatedAny.publicId || String(updatedAny.id),
        legacyId: updatedAny.id,
        name: updatedAny.name,
        slug: updatedAny.slug,
        description: updatedAny.description,
        price: updatedAny.price,
        salePrice: updatedAny.salePrice,
        stock: updatedAny.stock,
        status: updatedAny.status,
        isFeatured: updatedAny.isFeatured,
        categoryId: updatedAny.categoryId,
        category: updatedAny.category?.name || '',
        images: parseMediaList(updatedAny.images),
        image: getPrimaryMedia(updatedAny.images),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: Params) {
  try {
    const guard = await requireClerkRole('admin');
    if (guard) {
      return guard;
    }

    const { id } = await context.params;
    const productId = await findProductIdByParam(id);
    if (!productId) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const linkedOrderItem = await prisma.orderItem.findFirst({ where: { productId } });
    if (linkedOrderItem) {
      return NextResponse.json(
        { error: 'Cannot delete product that exists in orders. Set status to inactive instead.' },
        { status: 409 }
      );
    }

    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
