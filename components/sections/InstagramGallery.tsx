"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Instagram } from "lucide-react";

const instagramImages = [
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635077/newcollection-3_tacjvs.jpg",
    title: "Evening edit",
    meta: "Lustre, soft drape, statement finish",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635078/newcollection-4_ijlsmi.jpg",
    title: "Festive layers",
    meta: "Bright gold tones with bridal energy",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635080/newcollection-5_u8sk9n.jpg",
    title: "Pearl mood",
    meta: "Minimal shine with soft contrast",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635081/newcollection-6_ogng4l.jpg",
    title: "Signature frame",
    meta: "Clean portrait styling for the season",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635513/summer-5_r3pptq.jpg",
    title: "Summer story",
    meta: "Lighter textures and warm-day sparkle",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-4_ga77ea.jpg",
    title: "Weekend glow",
    meta: "Relaxed glamour with polished detail",
    position: "center center",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg",
    title: "Tailored shine",
    meta: "Structured styling with an elegant finish",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg",
    title: "Studio classic",
    meta: "Sharp lines and a luxurious palette",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg",
    title: "Fresh arrivals",
    meta: "New drop with timeless silhouette",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635113/suit-20_rquv3r.jpg",
    title: "Golden hour",
    meta: "Warm highlights with editorial depth",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635075/newcollection-2_xyzabc.jpg",
    title: "Modern bridal",
    meta: "Statement styling with refined details",
    position: "center top",
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635076/newcollection-3_xyz123.jpg",
    title: "Gallery finish",
    meta: "A final frame with bold texture",
    position: "center top",
  },
];

const cardConfigs = [
  { label: "New In", accent: "from-[#f5d06f]/35 via-transparent to-transparent", offset: 0 },
  { label: "Most Loved", accent: "from-[#8ad0ff]/25 via-transparent to-transparent", offset: 4 },
  { label: "Studio Picks", accent: "from-[#ff8a76]/25 via-transparent to-transparent", offset: 8 },
];

const instagramUrl = "https://instagram.com/sapphura.com";

function getLoopedImage(index: number) {
  return instagramImages[index % instagramImages.length];
}

export default function InstagramGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % instagramImages.length);
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#111533] px-4 py-16 md:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.16),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_24%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-[#f5d06f] backdrop-blur-sm">
              <Instagram className="h-4 w-4" />
              Follow The Feed
            </p>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Instagram moments, rebuilt as editorial cards.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/68 md:text-base">
              A cleaner gallery with rotating images, stronger focus on each frame, and a layout that feels closer to a fashion campaign than a generic social strip.
            </p>
          </div>

          <motion.a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#D4AF37]/40 bg-[#0a0f26]/80 px-5 py-3 text-sm font-medium text-[#f7d97d] shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-colors duration-200 hover:bg-[#121938]"
            whileHover={{ y: -2 }}
          >
            View Instagram
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.9fr_0.95fr]">
          {cardConfigs.map((card, cardIndex) => {
            const activeImage = getLoopedImage(activeIndex + card.offset);
            const previewImages = [1, 2, 3].map((step) => getLoopedImage(activeIndex + card.offset + step));

            return (
              <motion.a
                key={card.label}
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: cardIndex * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent}`} />

                <div className="relative flex items-center justify-between px-2 pb-3 pt-1">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f5d06f]">
                      {card.label}
                    </p>
                    <p className="mt-1 text-sm text-white/55">
                      @sapphura.com
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    Live rotation
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-[24px] bg-[#080d20]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${card.label}-${activeImage.src}`}
                        src={activeImage.src}
                        alt={activeImage.title}
                        className="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        style={{ objectPosition: activeImage.position }}
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                      />
                    </AnimatePresence>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060a19] via-[#060a19]/72 to-transparent p-5">
                      <p className="text-2xl font-semibold tracking-tight text-white">
                        {activeImage.title}
                      </p>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-white/72">
                        {activeImage.meta}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-white/10 bg-[#0c1127]/92 p-3">
                    {previewImages.map((image, previewIndex) => (
                      <div key={`${card.label}-${image.src}-${previewIndex}`} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.title}
                            className="absolute inset-0 block h-full w-full object-cover opacity-80 transition duration-300 group-hover:opacity-100"
                            style={{ objectPosition: image.position }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}