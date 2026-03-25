"use client";
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

const slides = [
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642077/eid_collection_vl7lxr.mp4',
    title: 'Timeless Luxury In Navy And Gold',
    description: 'Discover signature fashion, jewelry, and premium pieces presented with the calm elegance of Sapphura.',
    eyebrow: 'New Season Edit',
    primaryCta: { href: '/collections', label: 'Shop Now' },
  },
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg',
    title: 'Elegant Pieces For Every Occasion',
    description: 'A refined collection built around rich color, graceful silhouettes, and premium craftsmanship.',
    eyebrow: 'Signature Collection',
    primaryCta: { href: '/collections?category=clothing', label: 'Shop Now' },
  },
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642089/video-1_n61vcd.mp4',
    title: 'Designed To Keep The Product First',
    description: 'Calm presentation, rich navy surfaces, and gold details that let every product stand out.',
    eyebrow: 'Premium Edit',
    primaryCta: { href: '/collections?category=abaya', label: 'Shop Now' },
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
  const heroNotes = [
    'Refined navy and gold identity',
    'Premium product-first storytelling',
    'Elegant motion with modern depth',
  ];

  return (
    <section className="relative min-h-[72vh] overflow-hidden border-b border-[#d4af37]/12 bg-[#0a1630] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(19,33,63,0.42),transparent_28%),linear-gradient(180deg,rgba(10,22,48,0.08),rgba(9,17,31,0.46))]" />
      <div className="floating-orb absolute left-[7%] top-24 hidden h-24 w-24 rounded-full bg-[#d4af37]/14 blur-3xl lg:block" />
      <div className="floating-orb absolute right-[10%] bottom-20 hidden h-28 w-28 rounded-full bg-[#13213f]/46 blur-3xl lg:block" style={{ animationDelay: '1.2s' }} />

      <AnimatePresence mode="wait">
        <motion.div key={activeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="absolute inset-0">
          {isVideo ? (
            <video src={activeSlide.src} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            <img src={activeSlide.src} alt={activeSlide.title} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,12,27,0.88)_0%,rgba(6,12,27,0.62)_48%,rgba(6,12,27,0.32)_100%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="section-shell relative z-10 flex min-h-[72vh] flex-col justify-center py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <motion.p key={`${activeIndex}-eyebrow`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-5 inline-flex rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.38em] text-[#dbc6a4]">
              {activeSlide.eyebrow}
            </motion.p>
            <motion.h1 key={`${activeIndex}-title`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="max-w-4xl text-4xl font-semibold leading-tight text-[#fff8f0] sm:text-5xl lg:text-6xl">
              {activeSlide.title}
            </motion.h1>
            <motion.p key={`${activeIndex}-description`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }} className="mt-5 max-w-2xl text-base leading-7 text-[#f7efe5]/80 sm:text-lg">
              {activeSlide.description}
            </motion.p>
            <motion.div key={`${activeIndex}-cta`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.24 }} className="mt-8 flex flex-wrap gap-4">
              <Link href={activeSlide.primaryCta.href} className="inline-flex items-center rounded-full bg-[#d4af37] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-[#09111f] hover:bg-[#e2bf56]">
                {activeSlide.primaryCta.label}
              </Link>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18 }} className="luxury-card hidden rounded-[30px] p-6 lg:block">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4af37]">Sapphura Signature</p>
                <p className="mt-2 text-2xl font-semibold text-[#fff7ef]">Luxury with modern calm</p>
              </div>
              <div className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#f5df97]">
                Curated
              </div>
            </div>
            <div className="space-y-3">
              {heroNotes.map((note) => (
                <div key={note} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4af37]" />
                  <p className="text-sm text-[#fff7ef]/78">{note}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          {slides.map((slide, index) => (
            <button key={slide.title} type="button" onClick={() => setActiveIndex(index)} className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-14 bg-[#d4af37]' : 'w-7 bg-white/25 hover:bg-white/45'}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
