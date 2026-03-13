import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  return {
    title: 'Sapphura | Luxury Ecommerce',
    description: 'Shop luxury products at Sapphura. Discover exclusive collections, premium brands, and seamless shopping experience.',
    keywords: ['luxury', 'ecommerce', 'fashion', 'collections', 'premium', 'shop', 'Sapphura'],
    openGraph: {
      title: 'Sapphura | Luxury Ecommerce',
      description: 'Shop luxury products at Sapphura. Discover exclusive collections, premium brands, and seamless shopping experience.',
      url: 'https://sapphura.com',
      images: [
        {
          url: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Sapphura Luxury Ecommerce',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Sapphura | Luxury Ecommerce',
      description: 'Shop luxury products at Sapphura. Discover exclusive collections, premium brands, and seamless shopping experience.',
      images: ['https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sapphura/og-image.jpg'],
    },
  };
}
