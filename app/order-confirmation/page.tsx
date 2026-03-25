import type { Metadata } from 'next';
import { Suspense } from 'react';

import OrderConfirmationPageClient from './OrderConfirmationPageClient';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Review your confirmed Sapphura order details, shipping summary, and next steps after checkout.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Order Confirmation | Sapphura',
    description: 'Review your confirmed Sapphura order details, shipping summary, and next steps after checkout.',
    url: 'https://sapphura-db.vercel.app/order-confirmation',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg',
        width: 1200,
        height: 630,
        alt: 'Sapphura order confirmation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Confirmation | Sapphura',
    description: 'Review your confirmed Sapphura order details, shipping summary, and next steps after checkout.',
    images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg'],
  },
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationPageClient />
    </Suspense>
  );
}
