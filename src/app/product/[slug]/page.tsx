import React from "react";
import { motion } from "framer-motion";
import ProductGallery from "../../../components/ProductGallery";
import ProductInfo from "../../../components/ProductInfo";
import ProductTabs from "../../../components/ProductTabs";
import Reviews from "../../../components/Reviews";
import RelatedProducts from "../../../components/RelatedProducts";
import { Metadata } from 'next';
import SEOJsonLd from '../../../components/SEOJsonLd';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Replace with actual product fetch
  const product = {
    name: "Luxury Necklace",
    description: "A beautiful luxury necklace for every occasion.",
    images: [
      "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/neckles-1.jpeg",
      "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/neckles-2.jpeg",
      "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/neckles-3.jpeg"
    ],
    price: 4999,
    slug: params.slug,
  };
  return {
    title: `${product.name} | Sapphura`,
    description: product.description,
    keywords: [product.name, 'luxury', 'jewelry', 'Sapphura'],
    openGraph: {
      title: `${product.name} | Sapphura`,
      description: product.description,
      images: product.images.map(url => ({ url, width: 1200, height: 630, alt: product.name })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Sapphura`,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Demo product data (replace with API fetch)
  const product = {
    id: 1,
    name: "Luxury Necklace",
    slug: params.slug,
    description: "A beautiful luxury necklace for every occasion.",
    price: 4999,
    discountPrice: 3999,
    images: [
      "/neckles-1.jpeg",
      "/neckles-2.jpeg",
      "/neckles-3.jpeg"
    ],
    colors: ["Gold", "Rose Gold", "Silver"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 5,
    categoryId: 1,
    rating: 4.8,
    reviewsCount: 12,
    isBestSeller: true,
    createdAt: "2026-03-13"
  };

  // Structured data for Product
  const productJsonLd = {
    name: product.name,
    description: product.description,
    image: product.images.map(img => `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/products/${img.replace('/', '')}`),
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Sapphura' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  // Structured data for Breadcrumb
  const breadcrumbJsonLd = {
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sapphura.com/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://sapphura.com/products' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://sapphura.com/product/${product.slug}` },
    ],
  };

  // Structured data for Organization
  const orgJsonLd = {
    name: 'Sapphura',
    url: 'https://sapphura.com',
    logo: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/logo.png',
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-[#0a0a23] py-16 px-4 md:px-16">
      <SEOJsonLd type="Product" data={productJsonLd} />
      <SEOJsonLd type="Breadcrumb" data={breadcrumbJsonLd} />
      <SEOJsonLd type="Organization" data={orgJsonLd} />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      <ProductTabs product={product} />
      <Reviews productId={product.id} />
      <RelatedProducts categoryId={product.categoryId} />
    </motion.main>
  );
}
