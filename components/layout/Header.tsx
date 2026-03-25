"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, User, Search, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';

const primaryNav = [
  { href: '/', label: 'Home' },
  { href: '/collections', label: 'Shop' },
  { href: '/about', label: 'Story' },
  { href: '/contact', label: 'Contact' },
];

const categoryNav = [
  { href: '/collections?category=jewelry', label: 'Jewelry' },
  { href: '/collections?category=clothing', label: 'Clothing' },
  { href: '/collections?category=abaya', label: 'Abaya' },
  { href: '/collections?category=makeup', label: 'Beauty' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled || mobileMenuOpen ? 'rgba(10, 16, 27, 0.88)' : 'rgba(10, 16, 27, 0)',
        borderColor: scrolled || mobileMenuOpen ? 'rgba(219, 198, 164, 0.18)' : 'rgba(255, 255, 255, 0)',
        boxShadow: scrolled || mobileMenuOpen ? '0 18px 50px rgba(5, 8, 16, 0.28)' : '0 0 0 rgba(0,0,0,0)',
      }}
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
    >
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 rounded-full px-2 py-1 text-[#fff7ef] focus:outline-none focus:ring-2 focus:ring-[#d4af37]">
          <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635065/logo-1_nsterf.png" alt="Sapphura Logo" className="h-11 w-11 rounded-full border border-[#d4af37]/50 object-cover shadow-[0_12px_28px_rgba(212,175,55,0.18)]" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#dbc6a4]">Luxury House</p>
            <span className="text-2xl font-semibold tracking-[0.28em] text-[#fff7ef]">SAPPHURA</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="group relative text-sm uppercase tracking-[0.24em] text-[#f7efe5]/88">
              <span>{item.label}</span>
              <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[#d4af37] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setCollectionsOpen(true)} onMouseLeave={() => setCollectionsOpen(false)}>
            <button className="group relative text-sm uppercase tracking-[0.24em] text-[#f7efe5]/88">
              <span>Collections</span>
              <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-[#d4af37] transition-transform duration-300 group-hover:scale-x-100" />
            </button>

            <AnimatePresence>
              {collectionsOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="glass-panel soft-shadow absolute left-1/2 top-full mt-5 grid min-w-[340px] -translate-x-1/2 grid-cols-2 gap-2 rounded-[28px] p-4"
                >
                  {categoryNav.map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-[#fff7ef]/88 hover:border-[#d4af37]/40 hover:bg-white/5">
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/search" className="rounded-full border border-white/10 p-2.5 text-[#fff7ef]/85 hover:border-[#d4af37]/50 hover:text-[#d4af37]">
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
          <Link href="/wishlist" className="relative rounded-full border border-white/10 p-2.5 text-[#fff7ef]/85 hover:border-[#d4af37]/50 hover:text-[#d4af37]">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            {wishlistCount > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-[#d97d68] px-1.5 text-[10px] font-bold text-white">{wishlistCount}</span> : null}
          </Link>
          <Link href="/cart" className="relative rounded-full border border-white/10 p-2.5 text-[#fff7ef]/85 hover:border-[#d4af37]/50 hover:text-[#d4af37]">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {totalItems > 0 ? <span className="absolute -right-1 -top-1 rounded-full bg-[#d4af37] px-1.5 text-[10px] font-bold text-[#111827]">{totalItems}</span> : null}
          </Link>
          <Link href="/account" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-[#fff7ef]/88 hover:border-[#d4af37]/50 hover:text-[#d4af37] sm:inline-flex sm:items-center sm:gap-2">
            <User className="h-4 w-4" />
            Account
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="relative ml-1 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 lg:hidden"
          >
            <span className={`absolute h-0.5 w-5 bg-[#fff7ef] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 bg-[#fff7ef] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute h-0.5 w-5 bg-[#fff7ef] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            className="section-shell mb-4 rounded-[28px] border border-white/10 bg-[#0d1320]/96 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {[...primaryNav, ...categoryNav].map((item) => (
                <Link key={`${item.href}-${item.label}`} href={item.href} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#fff7ef]/88 hover:bg-white/5 hover:text-[#d4af37]">
                  {item.label}
                </Link>
              ))}
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-[#d4af37]/30 px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#d4af37]">
                Admin Login
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
