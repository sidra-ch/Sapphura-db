import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductDetailExperience, { ProductDetailData } from '../../../components/product/ProductDetailExperience';
import prisma from '../../../lib/db';
import { getPrimaryImageFromList, parseMediaList } from '../../../lib/media';

const SITE_URL = 'https://sapphura-db.vercel.app';

function getFallbackProductBySlug(slug: string): ProductDetailData | null {
  const fallbackProducts: Record<string, ProductDetailData> = {
    'collections-jewelry': {
      id: 'fallback-jewelry',
      legacyId: 0,
      name: 'Signature Jewelry',
      slug: 'collections-jewelry',
      description: 'Statement pieces with heirloom energy and modern polish.',
      price: 12990,
      salePrice: null,
      stock: 12,
      inStock: true,
      rating: 4.8,
      reviewsCount: 0,
      category: 'Jewelry',
      categoryId: 1,
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg'],
      variants: [],
      reviewEntries: [],
      relatedProducts: [],
    },
    'collections-abaya': {
      id: 'fallback-abaya',
      legacyId: 0,
      name: 'Premium Abaya',
      slug: 'collections-abaya',
      description: 'Soft structure, graceful layers, and rich movement.',
      price: 11490,
      salePrice: null,
      stock: 10,
      inStock: true,
      rating: 4.7,
      reviewsCount: 0,
      category: 'Abaya',
      categoryId: 2,
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635050/clothes_collection-4_leuaww.jpg',
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635050/clothes_collection-4_leuaww.jpg'],
      variants: [],
      reviewEntries: [],
      relatedProducts: [],
    },
    'collections-clothing': {
      id: 'fallback-clothing',
      legacyId: 0,
      name: 'Luxury Clothing Edit',
      slug: 'collections-clothing',
      description: 'Tailored silhouettes designed for elevated everyday looks.',
      price: 9990,
      salePrice: null,
      stock: 16,
      inStock: true,
      rating: 4.6,
      reviewsCount: 0,
      category: 'Clothing',
      categoryId: 4,
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg',
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg'],
      variants: [],
      reviewEntries: [],
      relatedProducts: [],
    },
    'collections-makeup': {
      id: 'fallback-makeup',
      legacyId: 0,
      name: 'Beauty Essentials',
      slug: 'collections-makeup',
      description: 'Finish the look with premium beauty must-haves.',
      price: 6490,
      salePrice: null,
      stock: 18,
      inStock: true,
      rating: 4.7,
      reviewsCount: 0,
      category: 'Makeup',
      categoryId: 5,
      image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635068/make-up_dfzsza.jpg',
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635068/make-up_dfzsza.jpg'],
      variants: [],
      reviewEntries: [],
      relatedProducts: [],
    },
  };

  return fallbackProducts[slug] || null;
}

function isRecoverableDbError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    message.includes('client password must be a string') ||
    message.includes('the server does not support ssl connections') ||
    message.includes('can\'t reach database server') ||
    message.includes('authentication failed') ||
    message.includes('sasl')
  );
}

async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, status: 'active' },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
      },
    });

    if (!product) {
      return getFallbackProductBySlug(slug);
    }

    const ratings = product.reviews
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating) && rating > 0);

    const rating = ratings.length
      ? Number((ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1))
      : 0;

    const images = parseMediaList(product.images);
    const primaryImage = getPrimaryImageFromList(images);

    const relatedProducts = await prisma.product.findMany({
      where: {
        status: 'active',
        categoryId: product.categoryId,
        NOT: { id: product.id },
      },
      include: {
        category: true,
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    return {
      id: product.publicId || String(product.id),
      legacyId: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      stock: product.stock,
      inStock: product.stock > 0,
      rating,
      reviewsCount: product.reviews.length,
      category: product.category?.name || '',
      categoryId: product.categoryId,
      image: primaryImage,
      images,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        size: variant.size,
        color: variant.color,
        material: variant.material,
        sku: variant.sku,
        stock: variant.stock,
        price: variant.price,
        image: variant.image || null,
      })),
      reviewEntries: product.reviews.map((review) => ({
        id: review.id,
        name: review.user?.name || 'Verified Customer',
        rating: review.rating,
        comment: review.comment || 'Loved the finish, quality, and overall feel of the piece.',
      })),
      relatedProducts: relatedProducts.map((item) => ({
        id: item.publicId || String(item.id),
        slug: item.slug,
        name: item.name,
        category: item.category?.name || '',
        price: item.price,
        salePrice: item.salePrice,
        image: getPrimaryImageFromList(parseMediaList(item.images)),
        rating: item.reviews.length
          ? Number((item.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / item.reviews.length).toFixed(1))
          : 0,
      })),
    };
  } catch (error) {
    if (isRecoverableDbError(error)) {
      console.warn('Product detail degraded mode:', error instanceof Error ? error.message : String(error));
      return getFallbackProductBySlug(slug);
    }

    throw error;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found at Sapphura.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const image = product.image || 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg';
  const title = `${product.name} – Premium ${product.category || 'Fashion'}`;
  const description = product.description.length > 150 ? `${product.description.slice(0, 147)}...` : product.description;
  const url = `${SITE_URL}/product/${product.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailExperience product={product} />;
}

