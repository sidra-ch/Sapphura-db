import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import CartDrawer from "../components/cart/CartDrawer";
import GlobalHeader from "../components/layout/GlobalHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://sapphura-db.vercel.app"),
  title: {
    default: "Sapphura – Premium Fashion & Lifestyle",
    template: "%s | Sapphura",
  },
  description: "Discover luxury fashion, curated collections, and premium quality products at Sapphura.",
  openGraph: {
    title: "Sapphura – Premium Fashion & Lifestyle",
    description: "Discover luxury fashion, curated collections, and premium quality products at Sapphura.",
    type: "website",
    url: "https://sapphura-db.vercel.app",
    siteName: "Sapphura",
    images: [
      {
        url: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg",
        width: 1200,
        height: 630,
        alt: "Sapphura premium fashion showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sapphura – Premium Fashion & Lifestyle",
    description: "Discover luxury fashion, curated collections, and premium quality products at Sapphura.",
    images: ["https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635065/logo-1_nsterf.png" type="image/png" />
      </head>
      <body className="antialiased">
        <Providers>
          <GlobalHeader />
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
