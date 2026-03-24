import { NextRequest, NextResponse } from 'next/server';

import prisma from '../../../../lib/db';
import { requireClerkRole } from '../../../../lib/clerk-rbac';
import { listCloudinaryAssets } from '../../../../lib/cloudinary-server';
import { parseMediaList } from '../../../../lib/media';

type CloudAsset = {
  publicId: string;
  url: string;
  type: 'image' | 'video';
};

type ExistingProduct = {
  id: number;
  slug: string;
  images: string;
};

function getAssetBaseName(publicId: string): string {
  const leaf = publicId.split('/').pop() || publicId;
  return leaf
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/_[a-z0-9]{5,}$/i, '');
}

function normalizeAssetKey(publicId: string): string {
  return getAssetBaseName(publicId)
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function titleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildDisplayName(assetBaseName: string): string {
  if (/^[a-z0-9]{16,}$/i.test(assetBaseName) && !/[-_\s]/.test(assetBaseName)) {
    return '';
  }

  return titleCase(
    assetBaseName
      .replace(/([a-z])([0-9])/gi, '$1 $2')
      .replace(/([0-9])([a-z])/gi, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .replace(/\b(vdo|video)\b/gi, 'Video')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function inferCategoryName(normalizedKey: string): string {
  if (/(abaya)/i.test(normalizedKey)) return 'Abaya';
  if (/(makeup|perfume|beauty)/i.test(normalizedKey)) return 'Makeup';
  if (/(hair|accessor)/i.test(normalizedKey)) return 'Accessories';
  if (/(suit|cloth|clothes|summer|winter|shawl|saree|eid|stitch)/i.test(normalizedKey)) return 'Clothing';
  return 'Jewelry';
}

function getMediaReferenceKey(mediaUrl: string): string {
  return normalizeAssetKey(mediaUrl.split('?')[0] || mediaUrl);
}

function getUniqueMediaUrls(media: CloudAsset[]): string[] {
  return media
    .filter((asset, index, list) => list.findIndex((item) => item.url === asset.url) === index)
    .map((asset) => asset.url);
}

function buildExistingProductMatches(existingProducts: ExistingProduct[], groups: Map<string, CloudAsset[]>) {
  const claimedGroupKeys = new Set<string>();

  const productMatches = existingProducts
    .map((product) => {
      const currentMedia = parseMediaList(product.images);
      const groupKeys = Array.from(new Set(currentMedia.map(getMediaReferenceKey).filter((key) => groups.has(key))));
      const matchedMedia = groupKeys.flatMap((key) => groups.get(key) || []);
      const nextMediaUrls = getUniqueMediaUrls(matchedMedia);
      const currentMediaUrls = Array.from(new Set(currentMedia));

      for (const key of groupKeys) {
        claimedGroupKeys.add(key);
      }

      return {
        id: product.id,
        slug: product.slug,
        groupKeys,
        currentMediaUrls,
        nextMediaUrls,
        needsUpdate: nextMediaUrls.length > 0 && JSON.stringify(currentMediaUrls) !== JSON.stringify(nextMediaUrls),
      };
    })
    .filter((product) => product.groupKeys.length > 0);

  return {
    productMatches,
    claimedGroupKeys,
  };
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireClerkRole('admin');
    if (guard) {
      return guard;
    }

    const body = await req.json().catch(() => ({}));
    const dryRun = body?.dryRun !== false;
    const prefix = typeof body?.prefix === 'string' && body.prefix.trim() && body.prefix.trim().toLowerCase() !== 'all'
      ? body.prefix.trim()
      : undefined;
    const defaultPrice = Number(body?.defaultPrice ?? 99);
    const defaultStock = Number(body?.defaultStock ?? 1);
    const status = String(body?.status || 'active').toLowerCase();

    if (!Number.isFinite(defaultPrice) || defaultPrice <= 0) {
      return NextResponse.json({ error: 'defaultPrice must be greater than zero' }, { status: 400 });
    }

    if (!Number.isInteger(defaultStock) || defaultStock < 0) {
      return NextResponse.json({ error: 'defaultStock must be a non-negative integer' }, { status: 400 });
    }

    if (!['active', 'inactive', 'draft'].includes(status)) {
      return NextResponse.json({ error: 'status must be active, inactive, or draft' }, { status: 400 });
    }

    const [assets, categories, existingProducts] = await Promise.all([
      listCloudinaryAssets(prefix),
      prisma.category.findMany({ orderBy: { id: 'asc' } }),
      prisma.product.findMany({
        select: {
          id: true,
          slug: true,
          images: true,
        },
      }),
    ]);

    const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));
    const existingSlugs = new Set(existingProducts.map((product) => product.slug));

    const libraryAssets: CloudAsset[] = [
      ...(assets.images || []).map((asset: any) => ({ publicId: asset.public_id, url: asset.secure_url, type: 'image' as const })),
      ...(assets.videos || []).map((asset: any) => ({ publicId: asset.public_id, url: asset.secure_url, type: 'video' as const })),
    ];

    const groups = new Map<string, CloudAsset[]>();
    for (const asset of libraryAssets) {
      const key = normalizeAssetKey(asset.publicId);
      const current = groups.get(key) || [];
      current.push(asset);
      groups.set(key, current);
    }

    const { productMatches, claimedGroupKeys } = buildExistingProductMatches(existingProducts, groups);
    const relinkableProducts = productMatches.filter((product) => product.needsUpdate);
    const alreadyLinkedProducts = productMatches.filter((product) => !product.needsUpdate);

    const existingMediaUrls = new Set(
      productMatches.flatMap((product) => product.nextMediaUrls)
    );

    const importableGroups = Array.from(groups.entries())
      .map(([normalizedKey, media]) => {
        const uniqueMedia = media.filter((asset, index, list) => list.findIndex((item) => item.url === asset.url) === index);
        const alreadyLinked = claimedGroupKeys.has(normalizedKey) || uniqueMedia.every((asset) => existingMediaUrls.has(asset.url));
        const categoryName = inferCategoryName(normalizedKey);
        const categoryId = categoryIdByName.get(categoryName) || categories[0]?.id;
        const assetBaseName = getAssetBaseName(uniqueMedia[0]?.publicId || normalizedKey);
        const name = buildDisplayName(assetBaseName);
        let slug = slugify(name) || `product-${normalizedKey}`;
        let suffix = 1;

        while (existingSlugs.has(slug)) {
          slug = `${slugify(name) || 'product'}-${suffix}`;
          suffix += 1;
        }

        return {
          normalizedKey,
          name,
          slug,
          categoryName,
          categoryId,
          media: uniqueMedia,
          alreadyLinked,
        };
      })
      .filter((group) => !group.alreadyLinked && Boolean(group.categoryId) && Boolean(group.name));

    if (dryRun) {
      return NextResponse.json({
        mode: 'dry-run',
        totalAssets: libraryAssets.length,
        groupedAssets: groups.size,
        existingMatchedAssets: libraryAssets.filter((asset) => existingMediaUrls.has(asset.url)).length,
        matchedExistingProducts: productMatches.length,
        relinkableProducts: relinkableProducts.length,
        alreadyLinkedProducts: alreadyLinkedProducts.length,
        importableGroups: importableGroups.length,
        importableAssetCount: importableGroups.reduce((sum, group) => sum + group.media.length, 0),
        sample: importableGroups.slice(0, 20).map((group) => ({
          name: group.name,
          slug: group.slug,
          category: group.categoryName,
          mediaCount: group.media.length,
        })),
      });
    }

    for (const product of relinkableProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: JSON.stringify(product.nextMediaUrls),
        },
      });
    }

    const createdProducts = [];
    for (const group of importableGroups) {
      const created = await prisma.product.create({
        data: {
          name: group.name,
          slug: group.slug,
          description: `${group.name} imported from Cloudinary media library.`,
          price: defaultPrice,
          stock: defaultStock,
          status,
          categoryId: group.categoryId as number,
          images: JSON.stringify(group.media.map((asset) => asset.url)),
        },
      });

      createdProducts.push({
        id: created.id,
        slug: created.slug,
        name: created.name,
        mediaCount: group.media.length,
      });
    }

    return NextResponse.json({
      mode: 'import',
      relinked: relinkableProducts.length,
      created: createdProducts.length,
      products: createdProducts.slice(0, 50),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to import Cloudinary products' },
      { status: 500 }
    );
  }
}