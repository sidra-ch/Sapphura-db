"use client";

import Link from 'next/link';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Crown, Gem, ShieldCheck, Sparkles, CheckCircle2, PlayCircle } from 'lucide-react';

const chapters = {
  sapphura: {
    slug: 'sapphura',
    eyebrow: 'Brand world',
    title: 'Sapphura luxury, presented as a complete signature world.',
    description: 'Discover the brand language, polished presentation, and premium catalog experience that shape the Sapphura identity.',
    highlights: ['Editorial presentation', 'Elevated product storytelling', 'Navy and gold signature finish'],
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635135/suit-34_pqw5w3.jpg',
    accent: 'from-[#d4af37]/28 via-[#d4af37]/8 to-transparent',
    quote: 'Sapphura should feel like a complete luxury house, not just a catalog.',
    metrics: [
      { value: '01', label: 'Signature brand world' },
      { value: '06', label: 'Luxury chapters live' },
      { value: '24/7', label: 'Premium storefront presence' },
    ],
    storyCards: [
      { title: 'Brand Signature', text: 'A complete world built around navy depth, gold detail, and calm confidence.' },
      { title: 'Campaign Feel', text: 'The page structure uses editorial spacing so every section feels intentional.' },
      { title: 'Commerce Clarity', text: 'Luxury presentation stays connected to clear shopping actions.' },
    ],
  },
  'signature-edit': {
    slug: 'signature-edit',
    eyebrow: 'Signature edit',
    title: 'A focused edit of statement pieces selected for high-impact luxury styling.',
    description: 'This chapter highlights hero looks, refined details, and premium wardrobe choices curated for standout presentation.',
    highlights: ['Hero products', 'Occasion-led styling', 'Polished visual hierarchy'],
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg',
    accent: 'from-[#f1d27a]/24 via-[#d4af37]/8 to-transparent',
    quote: 'A signature edit should feel selected, elevated, and ready for the spotlight.',
    metrics: [
      { value: 'Top', label: 'High-impact selections' },
      { value: '360', label: 'Editorial product framing' },
      { value: 'Elite', label: 'Occasion-ready styling' },
    ],
    storyCards: [
      { title: 'Hero Product Focus', text: 'The strongest pieces get the visual priority they deserve.' },
      { title: 'Sharper Hierarchy', text: 'Typography and spacing pull attention exactly where it should go.' },
      { title: 'Luxury Tone', text: 'Copy stays direct, polished, and premium instead of generic.' },
    ],
  },
  'luxe-craft': {
    slug: 'luxe-craft',
    eyebrow: 'Craftsmanship',
    title: 'Luxury craftsmanship with detail-driven presentation and strong visual depth.',
    description: 'Explore the construction, finish, and attention to detail behind pieces designed to feel deliberate and premium.',
    highlights: ['Material-led presentation', 'Refined finishing', 'Luxury detailing'],
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
    accent: 'from-[#b3d0ff]/18 via-[#13213f]/18 to-transparent',
    quote: 'Craft deserves close-up storytelling, texture, and visual depth.',
    metrics: [
      { value: 'Fine', label: 'Detail emphasis' },
      { value: 'Craft', label: 'Material-led direction' },
      { value: 'Refined', label: 'Finishing language' },
    ],
    storyCards: [
      { title: 'Texture First', text: 'Close framing and dark backgrounds elevate finish and material cues.' },
      { title: 'Precision Layout', text: 'Structured spacing makes each crafted element easier to read.' },
      { title: 'Premium Detail', text: 'Small polish points add up to a stronger perception of quality.' },
    ],
  },
  'premium-fashion': {
    slug: 'premium-fashion',
    eyebrow: 'Premium fashion',
    title: 'A modern premium fashion direction built for confidence and elegance.',
    description: 'See how the collection balances trend awareness with classic styling to keep the brand polished and wearable.',
    highlights: ['Modern silhouettes', 'Premium styling balance', 'Confident wardrobe direction'],
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg',
    accent: 'from-[#dbc6a4]/22 via-[#d4af37]/8 to-transparent',
    quote: 'Premium fashion should look current without losing timeless confidence.',
    metrics: [
      { value: 'Now', label: 'Modern silhouette direction' },
      { value: 'Style', label: 'Confident wardrobe cues' },
      { value: 'Blend', label: 'Classic meets current' },
    ],
    storyCards: [
      { title: 'Wardrobe Direction', text: 'The page frames products around real styling moods and occasions.' },
      { title: 'Balanced Modernity', text: 'Current taste stays grounded in elegance and premium restraint.' },
      { title: 'Confident Presentation', text: 'The visual system supports strength without becoming loud.' },
    ],
  },
  'curated-style': {
    slug: 'curated-style',
    eyebrow: 'Curated style',
    title: 'Curated style stories that make browsing feel like entering a luxury edit.',
    description: 'Each selection is grouped with intention, helping shoppers move through the catalog with clarity and taste.',
    highlights: ['Clear shopping paths', 'Editorial curation', 'Luxury browsing flow'],
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635050/clothes_collection-4_leuaww.jpg',
    accent: 'from-[#c7b09a]/22 via-[#13213f]/12 to-transparent',
    quote: 'Curation turns browsing into a guided luxury experience.',
    metrics: [
      { value: 'Guided', label: 'Shopping flow' },
      { value: 'Smart', label: 'Editorial grouping' },
      { value: 'Clear', label: 'Luxury decision path' },
    ],
    storyCards: [
      { title: 'Intentional Browsing', text: 'Products are grouped with stronger narrative and decision support.' },
      { title: 'Luxury Flow', text: 'The user moves through the page with less friction and more clarity.' },
      { title: 'Story-Led Layout', text: 'Editorial grouping raises the overall premium perception.' },
    ],
  },
  'trusted-quality': {
    slug: 'trusted-quality',
    eyebrow: 'Trusted quality',
    title: 'Trusted quality signals that strengthen confidence before and after checkout.',
    description: 'This page brings together premium assurance, product trust, and clean communication that supports conversion.',
    highlights: ['Purchase confidence', 'Trust-first experience', 'Quality-led messaging'],
    image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635068/make-up_dfzsza.jpg',
    accent: 'from-[#d4af37]/22 via-[#13213f]/16 to-transparent',
    quote: 'Luxury trust is built through consistency, reassurance, and visible quality cues.',
    metrics: [
      { value: 'Trust', label: 'Confidence-led presentation' },
      { value: 'Clear', label: 'Quality communication' },
      { value: 'Strong', label: 'Premium reassurance' },
    ],
    storyCards: [
      { title: 'Assurance Design', text: 'The interface surfaces quality messaging without cluttering the page.' },
      { title: 'Conversion Support', text: 'Trust signals are placed where users naturally look before acting.' },
      { title: 'Premium Reliability', text: 'The tone remains elegant while reinforcing confidence at every step.' },
    ],
  },
} as const;

const featureCards = [
  {
    icon: Crown,
    title: 'Luxury Direction',
    text: 'A focused page that keeps the premium Sapphura voice visible and active.',
  },
  {
    icon: Sparkles,
    title: 'Editorial Energy',
    text: 'Sharper storytelling and rich visual framing for a more elevated browsing mood.',
  },
  {
    icon: Gem,
    title: 'Curated Pieces',
    text: 'Refined collections and standout products surfaced with better emphasis.',
  },
  {
    icon: ShieldCheck,
    title: 'Premium Trust',
    text: 'Quality and confidence signals remain visible across the luxury experience.',
  },
];

function LuxuryPageContent() {
  const searchParams = useSearchParams();
  const chapterKey = searchParams.get('chapter') || 'sapphura';
  const chapter = chapters[chapterKey as keyof typeof chapters] || chapters.sapphura;
  const chapterEntries = Object.values(chapters);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(18,37,76,0.95),rgba(8,12,24,1)_58%)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/25 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.22em] text-[#dbc6a4] transition hover:border-[#d4af37]/45 hover:bg-[#d4af37] hover:text-[#09111f]">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {chapterEntries.map((item) => {
            const isActive = item.slug === chapter.slug;

            return (
              <Link
                key={item.slug}
                href={`/luxury?chapter=${item.slug}`}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${isActive ? 'border-[#d4af37]/40 bg-[#d4af37] text-[#09111f]' : 'border-white/10 bg-white/5 text-[#dbc6a4] hover:border-[#d4af37]/35 hover:bg-white/8 hover:text-[#fff7ef]'}`}
              >
                {item.eyebrow}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]">{chapter.eyebrow}</p>
            <AnimatePresence mode="wait">
              <motion.div key={chapter.slug} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#fff7ef] sm:text-5xl lg:text-6xl">{chapter.title}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">{chapter.description}</p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {chapter.highlights.map((item) => (
                    <span key={item} className="rounded-full border border-[#d4af37]/18 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#dbc6a4]">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/collections" className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#09111f] transition hover:bg-[#e6c45a]">
                    Explore Collections
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/about" className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#dbc6a4] transition hover:border-[#d4af37]/45 hover:bg-white/5 hover:text-[#fff7ef]">
                    Discover Brand Story
                  </Link>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {chapter.metrics.map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                      <p className="text-2xl font-semibold text-[#fff7ef]">{item.value}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#dbc6a4]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-[#d4af37]/15 bg-[linear-gradient(180deg,rgba(17,30,60,0.9),rgba(9,17,31,0.98))] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            <div className={`absolute inset-x-0 top-0 h-36 bg-gradient-to-b ${chapter.accent}`} />
            <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-[#d4af37]/12 blur-3xl" />
            <div className="absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[#17366b]/30 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div key={`${chapter.slug}-image`} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/10">
                  <img src={chapter.image} alt={chapter.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,17,31,0.04),rgba(9,17,31,0.82))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Active luxury chapter</p>
                    <p className="mt-2 text-2xl font-semibold text-[#fff7ef]">{chapter.eyebrow}</p>
                  </div>
                </div>
                <div className="absolute -left-4 top-6 rounded-2xl border border-white/10 bg-[#0d1730]/86 px-4 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <PlayCircle className="h-4 w-4" />
                    <span className="text-[11px] uppercase tracking-[0.24em]">Luxury motion</span>
                  </div>
                </div>
                <div className="absolute -bottom-5 right-4 max-w-[260px] rounded-[22px] border border-[#d4af37]/18 bg-[#0a1630]/92 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#d4af37]">Design note</p>
                  <p className="mt-3 text-sm leading-6 text-white/74">{chapter.quote}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-[#d4af37]/12 bg-[linear-gradient(180deg,rgba(15,26,50,0.86),rgba(9,17,31,0.94))] p-6 lg:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">Luxury story arc</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#fff7ef] sm:text-4xl">Designed to feel like a premium campaign page with direct shopping intent.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {chapter.storyCards.map((item, index) => (
                <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.35, delay: index * 0.08 }} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="inline-flex rounded-2xl bg-[#d4af37]/10 p-3 text-[#d4af37]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#fff7ef]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.text}</p>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-[#d4af37]/12 bg-[linear-gradient(180deg,rgba(15,26,50,0.82),rgba(9,17,31,0.94))] p-6 lg:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">Action path</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#fff7ef]">Move users from inspiration to product discovery cleanly.</h2>
            <div className="mt-6 space-y-4">
              {['Introduce the chapter with a strong luxury statement.', 'Support the theme with motion, imagery, and clear reassurance.', 'Move the visitor into collections without losing premium tone.'].map((step) => (
                <div key={step} className="flex items-start gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#d4af37]" />
                  <p className="text-sm leading-6 text-white/72">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/collections" className="inline-flex items-center gap-2 rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#09111f] transition hover:bg-[#e6c45a]">
                Shop the luxury edit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#dbc6a4] transition hover:border-[#d4af37]/45 hover:bg-white/5 hover:text-[#fff7ef]">
                Contact Sapphura
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article key={card.title} className="rounded-[24px] border border-[#d4af37]/12 bg-[linear-gradient(180deg,rgba(17,30,60,0.7),rgba(9,17,31,0.94))] p-6 text-[#fff7ef]">
                <div className="inline-flex rounded-2xl bg-[#d4af37]/10 p-3 text-[#d4af37]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/68">{card.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function LuxuryPageFallback() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(18,37,76,0.95),rgba(8,12,24,1)_58%)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="h-10 w-36 rounded-full border border-[#d4af37]/20 bg-white/5" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="h-4 w-28 rounded-full bg-[#d4af37]/20" />
            <div className="h-14 max-w-2xl rounded-[24px] bg-white/5" />
            <div className="h-28 max-w-2xl rounded-[24px] bg-white/5" />
          </div>
          <div className="aspect-[4/5] rounded-[30px] border border-[#d4af37]/12 bg-white/5" />
        </div>
      </section>
    </main>
  );
}

export default function LuxuryPageClient() {
  return (
    <Suspense fallback={<LuxuryPageFallback />}>
      <LuxuryPageContent />
    </Suspense>
  );
}