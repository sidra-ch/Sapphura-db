import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: 'Sapphura – Premium Fashion & Lifestyle',
    description: 'Discover luxury fashion, curated collections, and premium quality products at Sapphura.',
    keywords: ['luxury fashion', 'premium lifestyle', 'designer clothing', 'curated collections', 'Sapphura'],
    openGraph: {
      title: 'Sapphura – Premium Fashion & Lifestyle',
      description: 'Discover luxury fashion, curated collections, and premium quality products at Sapphura.',
      url: 'https://sapphura-db.vercel.app',
      images: [
        {
          url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg',
          width: 1200,
          height: 630,
          alt: 'Sapphura premium fashion showcase',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sapphura – Premium Fashion & Lifestyle',
      description: 'Discover luxury fashion, curated collections, and premium quality products at Sapphura.',
      images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg'],
    },
  };
}
