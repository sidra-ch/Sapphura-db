"use client";
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const slides = [
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642077/eid_collection_vl7lxr.mp4',
    title: 'Timeless Luxury In Navy And Gold',
    description: 'Discover signature fashion, jewelry, and premium pieces presented with the calm elegance of Sapphura.',
    eyebrow: 'New Season Edit',
    primaryCta: { href: '/collections', label: 'Shop Now' },
    secondaryCta: { href: '/luxury?chapter=sapphura', label: 'Explore Story' },
  },
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg',
    title: 'Elegant Pieces For Every Occasion',
    description: 'A refined collection built around rich color, graceful silhouettes, and premium craftsmanship.',
    eyebrow: 'Signature Collection',
    primaryCta: { href: '/collections?category=clothing', label: 'Shop Now' },
    secondaryCta: { href: '/luxury?chapter=curated-style', label: 'View Signature Edit' },
  },
  {
    src: 'https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642089/video-1_n61vcd.mp4',
    title: 'Designed To Keep The Product First',
    description: 'Calm presentation, rich navy surfaces, and gold details that let every product stand out.',
    eyebrow: 'Premium Edit',
    primaryCta: { href: '/collections?category=abaya', label: 'Shop Now' },
    secondaryCta: { href: '/luxury?chapter=trusted-quality', label: 'See Premium Story' },
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
  const heroNotes = ['Navy and gold identity', 'Premium product focus', 'Calm luxury presentation'];

  return (
    <section className="relative min-h-[38vh] overflow-hidden border-b border-[#d4af37]/12 bg-[#0a1630] text-white md:min-h-[46vh] lg:min-h-[54vh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(19,33,63,0.52),transparent_30%),linear-gradient(180deg,rgba(10,22,48,0.08),rgba(9,17,31,0.6))]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,rgba(9,17,31,0),rgba(9,17,31,0.7))]" />
      <div className="floating-orb absolute left-[7%] top-24 hidden h-24 w-24 rounded-full bg-[#d4af37]/14 blur-3xl lg:block" />
      <div className="floating-orb absolute right-[10%] bottom-20 hidden h-28 w-28 rounded-full bg-[#13213f]/46 blur-3xl lg:block" style={{ animationDelay: '1.2s' }} />
      <div className="floating-orb absolute right-[24%] top-24 hidden h-24 w-24 rounded-full bg-[#d4af37]/10 blur-3xl lg:block" style={{ animationDelay: '2.1s' }} />

      <AnimatePresence mode="wait">
        <motion.div key={activeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="absolute inset-0">
          {isVideo ? (
            <video src={activeSlide.src} autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover" />
          ) : (
            <img src={activeSlide.src} alt={activeSlide.title} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,12,27,0.92)_0%,rgba(6,12,27,0.68)_45%,rgba(6,12,27,0.36)_100%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="section-shell relative z-10 flex min-h-[38vh] flex-col justify-center py-8 md:min-h-[46vh] md:py-9 lg:min-h-[54vh] lg:py-10">
        <div className="grid items-center gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-7">
          <div className="max-w-3xl">
            <motion.div key={`${activeIndex}-copy`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-white/15 bg-white/6 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-[#dbc6a4] md:px-4 md:py-2 md:text-[11px] md:tracking-[0.38em]">
                  {activeSlide.eyebrow}
                </span>
              </div>
              <h1 className="max-w-4xl text-[2.1rem] font-semibold leading-[1.02] text-[#fff8f0] sm:text-[2.5rem] lg:text-[3.45rem] xl:text-[3.75rem]">
                {activeSlide.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f7efe5]/82 sm:mt-5 sm:text-base lg:max-w-xl">
                {activeSlide.description}
              </p>
            </motion.div>

            <motion.div key={`${activeIndex}-cta`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="mt-6 flex flex-wrap gap-3">
              <Link href={activeSlide.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#09111f] hover:bg-[#e2bf56] sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.22em]">
                {activeSlide.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={activeSlide.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/6 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#fff8f0] hover:border-[#d4af37]/45 hover:bg-white/10 sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.22em]">
                {activeSlide.secondaryCta.label}
              </Link>
            </motion.div>

            <motion.div key={`${activeIndex}-notes`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.28 }} className="mt-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#dbc6a4] sm:gap-3 sm:text-[11px] sm:tracking-[0.28em]">
              {heroNotes.map((note) => (
                <span key={note} className="rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 sm:px-4 sm:py-2">{note}</span>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.18 }} className="hidden lg:block">
            <div className="relative mx-auto max-w-[340px] xl:max-w-[380px]">
              <div className="absolute -left-4 top-7 h-24 w-24 rounded-full bg-[#d4af37]/14 blur-3xl" />
              <div className="absolute right-0 bottom-10 h-24 w-24 rounded-full bg-[#13213f]/50 blur-3xl" />
              <div className="relative overflow-hidden rounded-[30px] border border-[#d4af37]/16 bg-[linear-gradient(180deg,rgba(18,33,63,0.5),rgba(9,17,31,0.3))] p-3 shadow-[0_24px_60px_rgba(3,8,20,0.28)]">
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1326]">
                  {isVideo ? (
                    <video src={activeSlide.src} autoPlay muted loop playsInline preload="metadata" className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <img src={activeSlide.src} alt={activeSlide.title} className="aspect-[4/5] w-full object-cover" />
                  )}
                </div>
                <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-white/8" />
                <div className="absolute bottom-6 left-6 rounded-full border border-[#d4af37]/18 bg-[#0a1630]/78 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#f2de97] backdrop-blur-md">
                  Sapphura Signature
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 sm:mt-7">
          <div className="hidden text-[10px] uppercase tracking-[0.22em] text-[#dbc6a4] sm:block md:text-[11px] md:tracking-[0.28em]">
            Crafted for modern luxury
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {slides.map((slide, index) => (
              <button key={slide.title} type="button" onClick={() => setActiveIndex(index)} className={`rounded-full transition-all ${activeIndex === index ? 'h-2.5 w-12 bg-[#d4af37] sm:w-14' : 'h-2.5 w-6 bg-white/25 hover:bg-white/45 sm:w-7'}`} aria-label={`Go to slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCarousel;
