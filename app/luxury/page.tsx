import type { Metadata } from 'next';

import LuxuryPageClient from './LuxuryPageClient';

export const metadata: Metadata = {
  title: 'Luxury Chapters',
  description: 'Explore Sapphura luxury chapters, signature edits, premium fashion stories, and curated brand presentation.',
  openGraph: {
    title: 'Luxury Chapters | Sapphura',
    description: 'Explore Sapphura luxury chapters, signature edits, premium fashion stories, and curated brand presentation.',
    url: 'https://sapphura-db.vercel.app/luxury',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635135/suit-34_pqw5w3.jpg',
        width: 1200,
        height: 630,
        alt: 'Sapphura luxury chapter preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Chapters | Sapphura',
    description: 'Explore Sapphura luxury chapters, signature edits, premium fashion stories, and curated brand presentation.',
    images: ['https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635135/suit-34_pqw5w3.jpg'],
  },
};

export default function LuxuryPage() {
  return <LuxuryPageClient />;
}