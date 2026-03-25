"use client";
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

const slides = [
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642077/eid_collection_vl7lxr.mp4',
    title: 'Crafted For The Spotlight',
    description: 'Signature silhouettes, heirloom jewelry, and premium styling curated for modern luxury wardrobes.',
    eyebrow: 'New Season Edit',
    primaryCta: { href: '/collections', label: 'Shop The Edit' },
    secondaryCta: { href: '/about', label: 'Our Story' },
  },
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg',
    title: 'Luxury That Feels Editorial',
    description: 'Discover conversion-focused fashion storytelling with a polished, premium retail atmosphere.',
    eyebrow: 'Premium Lifestyle',
    primaryCta: { href: '/collections?category=clothing', label: 'Explore Clothing' },
    secondaryCta: { href: '/collections?category=jewelry', label: 'View Jewelry' },
  },
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642089/video-1_n61vcd.mp4',
    title: 'High Motion. High Intent.',
    description: 'Video-led merchandising, tactile card interactions, and a storefront tuned for premium product discovery.',
    eyebrow: 'Immersive Commerce',
    primaryCta: { href: '/collections?category=abaya', label: 'Browse Abaya' },
    secondaryCta: { href: '/collections?category=makeup', label: 'Beauty Picks' },
  },
];

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];
  const isVideo = activeSlide.src.endsWith('.mp4');

  return (
    <section className="relative min-h-[88vh] overflow-hidden border-b border-white/10 bg-[#0c1220] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,125,104,0.16),transparent_26%)]" />
      <div className="floating-orb absolute left-[8%] top-28 hidden h-32 w-32 rounded-full bg-[#d4af37]/10 blur-3xl lg:block" />
      <div className="floating-orb absolute right-[12%] top-44 hidden h-40 w-40 rounded-full bg-[#d97d68]/12 blur-3xl lg:block" style={{ animationDelay: '1s' }} />

      <AnimatePresence mode="wait">
        <motion.div key={activeIndex} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.9, ease: 'easeOut' }} className="absolute inset-0">
          {isVideo ? (
            <video src={activeSlide.src} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={activeSlide.src} alt={activeSlide.title} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,18,0.82)_0%,rgba(7,11,18,0.52)_40%,rgba(7,11,18,0.18)_100%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="section-shell relative z-10 flex min-h-[88vh] flex-col justify-center py-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl">
            <motion.p key={`${activeIndex}-eyebrow`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-5 inline-flex rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.38em] text-[#dbc6a4]">
              {activeSlide.eyebrow}
            </motion.p>
            <motion.h1 key={`${activeIndex}-title`} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }} className="max-w-4xl text-5xl font-semibold leading-[0.92] text-[#fff8f0] sm:text-6xl lg:text-7xl">
              {activeSlide.title}
            </motion.h1>
            <motion.p key={`${activeIndex}-description`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="mt-6 max-w-2xl text-base leading-7 text-[#f7efe5]/82 sm:text-lg">
              {activeSlide.description}
            </motion.p>
            <motion.div key={`${activeIndex}-cta`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }} className="mt-10 flex flex-wrap gap-4">
              <Link href={activeSlide.primaryCta.href} className="glow-pulse inline-flex items-center rounded-full bg-[#f7efe5] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.24em] text-[#111827] hover:-translate-y-0.5">
                {activeSlide.primaryCta.label}
              </Link>
              <Link href={activeSlide.secondaryCta.href} className="inline-flex items-center rounded-full border border-white/18 bg-white/6 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.24em] text-[#fff8f0] hover:border-[#d4af37]/50 hover:bg-white/10">
                {activeSlide.secondaryCta.label}
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="glass-panel soft-shadow ml-auto max-w-md rounded-[32px] p-6 text-[#fff7ef]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Why it converts</p>
            <div className="mt-5 space-y-4">
              {['Editorial hero storytelling', 'Luxury-grade visual hierarchy', 'Mobile-first interactions with clear CTAs'].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#d4af37]" />
                  <p className="text-sm leading-6 text-[#fff7ef]/80">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#f7efe5] px-4 py-3 text-[#111827]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#7b6a54]">Client-ready</p>
                <p className="text-lg font-semibold">Premium commerce experience</p>
              </div>
              <div className="rounded-full bg-[#111827] px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-[#f7efe5]">Live</div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-3">
          {slides.map((slide, index) => (
            <button key={slide.title} type="button" onClick={() => setActiveIndex(index)} className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-14 bg-[#d4af37]' : 'w-7 bg-white/25 hover:bg-white/45'}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
