"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Sparkles, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { FormEvent, useState } from 'react';
import HeroCarousel from './HeroCarousel';
import BestSellers from './BestSellers';

const features = [
  {
    icon: Crown,
    title: 'Luxury Positioning',
    description: 'Editorial layouts, immersive media, and premium visual rhythm tailored for high-end products.',
  },
  {
    icon: Sparkles,
    title: 'Curated Collections',
    description: 'Category storytelling that guides discovery and keeps the browsing journey elegant and clear.',
  },
  {
    icon: Truck,
    title: 'Fast Fulfillment',
    description: 'Conversion-oriented messaging around shipping, support, and purchase confidence.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust Signals',
    description: 'Premium reassurance surfaces for quality, return flexibility, and customer confidence.',
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

const brands = ['SAPPHURA', 'SIGNATURE EDIT', 'LUXE CRAFT', 'MODERN HEIRLOOM', 'CURATED DROP', 'PREMIUM WOMENSWEAR'];

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

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
    setEmail('');
  }

  return (
    <main className="luxury-shell min-h-screen text-white">
      <HeroCarousel />

      <section className="section-shell py-24 text-[#fff7ef]">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#9d8662]">Luxury framework</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#111827] sm:text-5xl">A premium storefront built to feel cinematic, calm, and conversion-ready.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#4b5563]">Every section is designed to create momentum: rich visuals, persuasive spacing, elevated copy hierarchy, and clear purchase pathways.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article key={feature.title} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.08 }} viewport={{ once: true, margin: '-80px' }} className="soft-shadow rounded-[28px] border border-black/5 bg-white p-6 text-[#111827] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,24,39,0.12)]">
                <div className="mb-5 inline-flex rounded-2xl bg-[#f6ede2] p-3 text-[#d97d68]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#4b5563]">{feature.description}</p>
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
              <Link href={category.href} className="group relative block overflow-hidden rounded-[30px] border border-white/10 bg-[#111827] soft-shadow">
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

      <section className="overflow-hidden border-y border-white/8 bg-[#0b1220] py-5">
        <div className="animate-marquee flex items-center gap-4 whitespace-nowrap pr-4 text-[#dbc6a4] hover:[animation-play-state:paused]">
          {[...brands, ...brands].map((brand, index) => (
            <span key={`${brand}-${index}`} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.38em]">{brand}</span>
          ))}
        </div>
      </section>

      <BestSellers />

      <section className="section-shell py-24 text-white">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} className="soft-shadow group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#101827]">
            <div className="aspect-[16/11] overflow-hidden">
              <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg" alt="Sapphura editorial frame" className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0" />
              <video src="https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642074/eid_collection_video_azi53n.mp4" muted playsInline loop autoPlay className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" />
            </div>
            <div className="absolute left-5 top-5 rounded-full border border-white/14 bg-black/25 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#fff7ef] backdrop-blur-md">Hover reveals motion</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Interactive media</p>
            <h2 className="max-w-2xl text-4xl font-semibold text-[#fff7ef] sm:text-5xl">Visual storytelling that moves from desire to decision.</h2>
            <div className="space-y-4 text-base leading-8 text-[#fff7ef]/72">
              <p>Use imagery for atmosphere, motion for attention, and structured product copy for clarity. The section is designed to feel like an ad campaign with direct commerce intent.</p>
              <p>Badges, stock cues, and action-first calls to action create urgency without making the experience feel cheap or noisy.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#d4af37]">Best Seller</span>
              <span className="rounded-full border border-[#d97d68]/30 bg-[#d97d68]/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#f6b8aa]">Limited Stock</span>
            </div>
            <Link href="/collections" className="inline-flex items-center rounded-full bg-[#f7efe5] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#111827] hover:-translate-y-0.5">
              Explore Featured Pieces
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#101827] soft-shadow">
          <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635135/suit-34_pqw5w3.jpg" alt="Sapphura testimonial background" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,16,27,0.9),rgba(10,16,27,0.72))]" />
          <div className="floating-orb absolute -left-8 top-12 h-28 w-28 rounded-full bg-[#d4af37]/16 blur-2xl" />
          <div className="floating-orb absolute right-0 top-0 h-36 w-36 rounded-full bg-[#d97d68]/16 blur-3xl" style={{ animationDelay: '1.4s' }} />

          <div className="relative grid gap-8 px-6 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Proof + retention</p>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold text-[#fff7ef] sm:text-5xl">Trust-rich messaging paired with a clean newsletter capture surface.</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="glass-panel rounded-[24px] p-5 text-sm leading-7 text-[#fff7ef]/80">
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
                <button type="submit" className="w-full rounded-full bg-[#f7efe5] px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#111827] hover:-translate-y-0.5">Subscribe</button>
              </form>
              {submitted ? <p className="mt-4 text-sm text-[#dbc6a4]">Thank you. You are on the Sapphura list.</p> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}