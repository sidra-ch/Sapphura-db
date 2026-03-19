import type { Metadata } from "next";
import Link from 'next/link';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import "./globals.css";
import { Providers } from "../components/Providers";
import CartDrawer from "../components/cart/CartDrawer";
import GlobalHeader from "../components/layout/GlobalHeader";

export const metadata: Metadata = {
  title: "Sapphura - Luxury Fashion",
  description: "Discover timeless elegance with Sapphura's exclusive collection.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authState = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635065/logo-1_nsterf.png" type="image/png" />
        </head>
        <body className="antialiased">
          <header className="flex items-center justify-end gap-2 bg-[#0a0a23] px-4 py-2 text-sm text-white">
            {authState.userId ? (
              <Link href="/account" className="rounded border border-gold px-3 py-1 text-gold">My account</Link>
            ) : (
              <>
              <Link href="/sign-in" className="rounded border border-gold px-3 py-1 text-gold">Sign in</Link>
              <Link href="/sign-up" className="rounded bg-gold px-3 py-1 text-[#0a0a23]">Sign up</Link>
              </>
            )}
          </header>
          <Providers>
            <GlobalHeader />
            {children}
            <CartDrawer />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
