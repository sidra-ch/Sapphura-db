"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Sparkles, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { FormEvent, PointerEvent, useRef, useState } from 'react';
import HeroCarousel from './HeroCarousel';
import BestSellers from './BestSellers';

const features = [
  {
    icon: Crown,
    title: 'Luxury Positioning',
    description: 'A refined navy and gold storefront that keeps the focus on premium products.',
  },
  {
    icon: Sparkles,
    title: 'Curated Collections',
    description: 'Clear category browsing with calm visuals and strong spacing.',
  },
  {
    icon: Truck,
    title: 'Fast Fulfillment',
    description: 'Fast delivery messaging presented with a clean, premium tone.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust Signals',
    description: 'Trust signals that support purchase confidence without visual clutter.',
  },
];

const categories = [
  {
    title: 'Jewelry',
    href: '/collections?category=jewelry',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
    blurb: 'Statement pieces with heirloom energy.',
  },
  {
    title: 'Clothing',
    href: '/collections?category=clothing',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg',
    blurb: 'Tailored edits for polished everyday drama.',
  },
  {
    title: 'Abaya',
    href: '/collections?category=abaya',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635050/clothes_collection-4_leuaww.jpg',
    blurb: 'Soft structure, movement, and graceful layers.',
  },
  {
    title: 'Beauty',
    href: '/collections?category=makeup',
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635068/make-up_dfzsza.jpg',
    blurb: 'Finish the look with elevated essentials.',
  },
];

const luxuryChapters = [
  { label: 'SAPPHURA', href: '/luxury?chapter=sapphura' },
  { label: 'SIGNATURE EDIT', href: '/luxury?chapter=signature-edit' },
  { label: 'LUXE CRAFT', href: '/luxury?chapter=luxe-craft' },
  { label: 'PREMIUM FASHION', href: '/luxury?chapter=premium-fashion' },
  { label: 'CURATED STYLE', href: '/luxury?chapter=curated-style' },
  { label: 'TRUSTED QUALITY', href: '/luxury?chapter=trusted-quality' },
];

const testimonials = [
  {
    quote: 'The visual experience feels premium from the first second. It looks like a campaign page, not a generic storefront.',
    name: 'Areeba Khan',
    role: 'Private Client',
  },
  {
    quote: 'The way products move, load, and reveal information creates real confidence before checkout.',
    name: 'Sana Malik',
    role: 'Returning Customer',
  },
  {
    quote: 'Elegant, minimal, and highly polished. It feels luxury without becoming heavy or slow.',
    name: 'Hania Saeed',
    role: 'Brand Collaborator',
  },
];

export default function LuxuryStorefront() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false);
  const [isMarqueeDragging, setIsMarqueeDragging] = useState(false);
  const marqueeItems = [...luxuryChapters, ...luxuryChapters];
  const marqueeViewportRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ isPointerDown: false, startX: 0, startScrollLeft: 0 });

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
    setEmail('');
  }

  function handleMarqueePointerDown(event: PointerEvent<HTMLDivElement>) {
    const viewport = marqueeViewportRef.current;
    if (!viewport) {
      return;
    }

    dragStateRef.current = {
      isPointerDown: true,
      startX: event.clientX,
      startScrollLeft: viewport.scrollLeft,
    };

    setIsMarqueeDragging(true);
    viewport.setPointerCapture(event.pointerId);
  }

  function handleMarqueePointerMove(event: PointerEvent<HTMLDivElement>) {
    const viewport = marqueeViewportRef.current;
    if (!viewport || !dragStateRef.current.isPointerDown) {
      return;
    }

    const dragDistance = event.clientX - dragStateRef.current.startX;
    viewport.scrollLeft = dragStateRef.current.startScrollLeft - dragDistance;
  }

  function handleMarqueePointerUp(event: PointerEvent<HTMLDivElement>) {
    const viewport = marqueeViewportRef.current;
    dragStateRef.current.isPointerDown = false;
    setIsMarqueeDragging(false);

    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }

  const shouldPauseMarquee = isMarqueeHovered || isMarqueeDragging;

  return (
    <main className="luxury-shell min-h-screen text-white">
      <HeroCarousel />

      <section className="section-shell py-24 text-[#fff7ef]">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#d4af37]">Luxury framework</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#fff7ef] sm:text-5xl">A cleaner Sapphura storefront built around navy surfaces and gold accents.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#fff7ef]/72">The layout stays premium without drifting away from your brand identity, keeping the experience elegant and product-focused.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.08 }} viewport={{ once: true, margin: '-80px' }} className="luxury-card hover-lift rounded-[24px] p-6 text-[#fff7ef]">
                <div className="mb-5 inline-flex rounded-2xl bg-[#d4af37]/10 p-3 text-[#d4af37]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#fff7ef]/66">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#dbc6a4]">Categories</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#fff7ef] sm:text-5xl">Shop by mood, wardrobe, and occasion.</h2>
          </div>
          <Link href="/collections" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.26em] text-[#dbc6a4] hover:text-[#d4af37]">
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div key={category.title} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: index * 0.07 }} viewport={{ once: true, margin: '-60px' }}>
              <Link href={category.href} className="group luxury-card sheen-hover hover-lift relative block rounded-[24px]">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={category.image} alt={category.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.04),rgba(17,24,39,0.82))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Collection</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#fff7ef]">{category.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#fff7ef]/72">{category.blurb}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#d4af37]/10 bg-[#09111f] py-5">
        <div className="section-shell">
          <div
            ref={marqueeViewportRef}
            onMouseEnter={() => setIsMarqueeHovered(true)}
            onMouseLeave={() => setIsMarqueeHovered(false)}
            onPointerDown={handleMarqueePointerDown}
            onPointerMove={handleMarqueePointerMove}
            onPointerUp={handleMarqueePointerUp}
            onPointerCancel={handleMarqueePointerUp}
            className="no-scrollbar relative overflow-x-auto overflow-y-hidden rounded-full border border-[#d4af37]/12 bg-[#0d1730] px-3 py-3 cursor-grab active:cursor-grabbing touch-pan-x"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-[linear-gradient(90deg,#09111f,rgba(9,17,31,0))]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-[linear-gradient(270deg,#09111f,rgba(9,17,31,0))]" />
            <div
              className="animate-marquee flex w-max items-center gap-3"
              style={{ animationPlayState: shouldPauseMarquee ? 'paused' : 'running' }}
            >
              {marqueeItems.map((item, index) => (
                <Link
                  key={`${item.label}-${index}`}
                  href={item.href}
                  className="group relative inline-flex shrink-0 items-center gap-3 rounded-full border border-[#d4af37]/12 bg-[#10203f] px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#dbc6a4] transition hover:border-[#d4af37]/40 hover:bg-[#15264c] hover:text-[#fff7ef]"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.6)] animate-pulse" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BestSellers />

      <section className="section-shell py-24 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} className="group luxury-card sheen-hover hover-lift relative rounded-[28px]">
            <div className="aspect-[16/11] overflow-hidden">
              <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg" alt="Sapphura editorial frame" className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0" />
              <video src="https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642074/eid_collection_video_azi53n.mp4" muted playsInline loop autoPlay preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
            <div className="absolute left-5 top-5 rounded-full border border-[#d4af37]/20 bg-[#0a1630]/75 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[#fff7ef] backdrop-blur-md">Sapphura Edit</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Signature presentation</p>
            <h2 className="max-w-2xl text-4xl font-semibold text-[#fff7ef] sm:text-5xl">A premium layout that stays aligned with your original navy and gold brand.</h2>
            <div className="space-y-4 text-base leading-8 text-[#fff7ef]/72">
              <p>Rich imagery still supports the storefront, but the overall treatment now stays calmer, darker, and more consistent with Sapphura.</p>
              <p>Gold accents, clean copy, and balanced spacing keep the product as the focal point instead of overwhelming the page.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#d4af37]">Premium Quality</span>
              <span className="rounded-full border border-[#d4af37]/18 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#dbc6a4]">Trusted Delivery</span>
              <span className="rounded-full border border-[#d4af37]/18 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#dbc6a4]">Modern Luxury</span>
            </div>
            <Link href="/collections" className="inline-flex items-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#09111f] hover:bg-[#e2bf56]">
              Explore Featured Pieces
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="relative overflow-hidden rounded-[30px] border border-[#d4af37]/10 bg-[#101827] soft-shadow">
          <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635135/suit-34_pqw5w3.jpg" alt="Sapphura testimonial background" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,16,27,0.9),rgba(10,16,27,0.72))]" />
          <div className="floating-orb absolute -left-8 top-12 h-28 w-28 rounded-full bg-[#d4af37]/14 blur-2xl" />
          <div className="floating-orb absolute right-0 top-0 h-36 w-36 rounded-full bg-[#13213f]/30 blur-3xl" style={{ animationDelay: '1.4s' }} />

          <div className="relative grid gap-8 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Proof + retention</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold text-[#fff7ef] sm:text-5xl">Trust-rich messaging paired with a clean newsletter capture surface.</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="glass-panel hover-lift rounded-[24px] p-5 text-sm leading-7 text-[#fff7ef]/80">
                    <p>“{testimonial.quote}”</p>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="font-semibold text-[#fff7ef]">{testimonial.name}</p>
                      <p className="text-xs uppercase tracking-[0.26em] text-[#dbc6a4]">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel my-auto rounded-[30px] p-6 text-[#fff7ef] lg:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Newsletter</p>
              <h3 className="mt-4 text-3xl font-semibold">Join the private list for launches, edits, and early drops.</h3>
              <p className="mt-4 text-sm leading-7 text-[#fff7ef]/72">Capture subscribers with a simple, elegant panel that feels native to the premium visual language of the brand.</p>
              <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-3">
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Enter your email" className="w-full rounded-full border border-white/14 bg-white/8 px-5 py-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#d4af37]/50" />
                <button type="submit" className="w-full rounded-full bg-[#d4af37] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#09111f] hover:bg-[#e2bf56]">Subscribe</button>
              </form>
              {submitted ? <p className="mt-4 text-sm text-[#dbc6a4]">Thank you. You are on the Sapphura list.</p> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}