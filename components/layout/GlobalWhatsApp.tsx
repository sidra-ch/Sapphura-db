"use client";

import { usePathname } from 'next/navigation';

import WhatsAppFloating from '../sections/WhatsAppFloating';

export default function GlobalWhatsApp() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <WhatsAppFloating />;
}
