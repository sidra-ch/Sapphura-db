import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import CartDrawer from "../components/cart/CartDrawer";
import GlobalHeader from "../components/layout/GlobalHeader";

export const metadata: Metadata = {
  title: "Sapphura - Luxury Fashion",
  description: "Discover timeless elegance with Sapphura's exclusive collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635065/logo-1_nsterf.png" type="image/png" />
      </head>
      <body
        className="antialiased"
      >
        <Providers>
          <GlobalHeader />
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
