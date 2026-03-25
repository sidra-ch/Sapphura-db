import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductDetailExperience, { ProductDetailData } from '../../../components/product/ProductDetailExperience';
import prisma from '../../../lib/db';
import { getPrimaryImageFromList, parseMediaList } from '../../../lib/media';

const SITE_URL = 'https://sapphura-db.vercel.app';

async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
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
    return null;
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

