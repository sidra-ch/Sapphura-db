"use client";

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Heart, Play, ShieldCheck, ShoppingCart, Sparkles, Star, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';
import { FALLBACK_PRODUCT_IMAGE, getPrimaryImageFromList, isVideoUrl } from '../../lib/media';
import { buildMetaCartPayload, trackMetaEvent } from '../../lib/meta-pixel';

type Variant = {
  id: number;
  size: string | null;
  color: string | null;
  material: string | null;
  sku: string | null;
  stock: number;
  price: number;
  image: string | null;
};

type ReviewEntry = {
  id: number;
  name: string;
  rating: number;
  comment: string;
};

type RelatedProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  salePrice: number | null;
  image: string;
  rating: number;
};

export type ProductDetailData = {
  id: string;
  legacyId?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  category: string;
  categoryId: number;
  image: string;
  images: string[];
  variants: Variant[];
  reviewEntries: ReviewEntry[];
  relatedProducts: RelatedProduct[];
};

const accordionContent = [
  { key: 'details', label: 'Description' },
  {
    key: 'craft',
    label: 'Craft & Care',
    body: 'Each piece is styled for premium presentation. Store carefully, avoid harsh chemicals, and keep fabric and jewelry pieces protected between wears.',
  },
  {
    key: 'shipping',
    label: 'Shipping & Returns',
    body: 'Fast order handling, premium packaging, and responsive post-purchase support are built into the storefront experience for trust and repeat purchase intent.',
  },
];

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(0)}`;
}

function buildVariantLabel(variant: Variant) {
  return [variant.size, variant.color, variant.material].filter(Boolean).join(' • ') || variant.sku || `Option ${variant.id}`;
}

export default function ProductDetailExperience({ product }: { product: ProductDetailData }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState('details');
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(product.variants[0]?.id ?? null);

  const wishlistKey = product.slug || product.id;
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) || null;
  const mediaItems = useMemo(
    () => (product.images?.length ? product.images : [FALLBACK_PRODUCT_IMAGE]),
    [product.images]
  );
  const selectedMedia = mediaItems[selectedMediaIndex] || FALLBACK_PRODUCT_IMAGE;
  const selectedMediaIsVideo = isVideoUrl(selectedMedia);
  const previewImage = selectedVariant?.image || product.image || getPrimaryImageFromList(mediaItems);
  const displayPrice = selectedVariant?.price ?? product.salePrice ?? product.price;
  const compareAtPrice = selectedVariant ? product.price : product.salePrice ? product.price : null;
  const displayStock = selectedVariant?.stock ?? product.stock;
  const activeVariantLabel = selectedVariant ? buildVariantLabel(selectedVariant) : 'Signature Selection';
  const visualReviewMedia = useMemo(() => mediaItems.slice(0, 4), [mediaItems]);

  function handleAddToCart() {
    if (displayStock <= 0) {
      return;
    }

    addToCart({
      id: selectedVariant ? `${product.slug}-${selectedVariant.id}` : product.slug,
      productId: product.id,
      slug: product.slug,
      name: selectedVariant ? `${product.name} (${activeVariantLabel})` : product.name,
      image: previewImage,
      price: displayPrice,
      quantity: Math.min(quantity, displayStock),
      variant: selectedVariant ? activeVariantLabel : undefined,
      variantId: selectedVariant?.id,
    });

    trackMetaEvent(
      'AddToCart',
      buildMetaCartPayload(
        [{ id: selectedVariant ? `${product.id}:${selectedVariant.id}` : product.id, quantity: Math.min(quantity, displayStock) }],
        displayPrice * Math.min(quantity, displayStock)
      )
    );
  }

  function handleWishlist() {
    if (isInWishlist(wishlistKey)) {
      removeFromWishlist(wishlistKey);
      return;
    }

    addToWishlist({
      id: wishlistKey,
      slug: product.slug,
      name: product.name,
      image: previewImage,
      price: displayPrice,
    });
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a1630_0%,#10203f_18%,#09111f_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="section-shell">
        <Link href="/collections" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#dbc6a4] hover:border-[#d4af37]/45 hover:text-[#d4af37]">
          <ArrowLeft className="h-4 w-4" />
          Back to collections
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="lg:sticky lg:top-28">
            <div className="luxury-card rounded-[34px]">
              <div className="relative aspect-[4/5] overflow-hidden bg-black">
                {selectedMediaIsVideo ? (
                  <video key={selectedMedia} src={selectedMedia} controls playsInline preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <img src={selectedMedia} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#fff7ef] backdrop-blur-md">{product.category}</span>
                  {displayStock > 0 ? <span className="rounded-full border border-emerald-300/20 bg-emerald-500/18 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-emerald-200">In Stock</span> : <span className="rounded-full border border-rose-300/20 bg-rose-500/18 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-rose-200">Sold Out</span>}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 p-4 sm:grid-cols-5">
                {mediaItems.map((media, index) => {
                  const mediaIsVideo = isVideoUrl(media);
                  return (
                    <button key={`${media}-${index}`} type="button" onClick={() => setSelectedMediaIndex(index)} className={`relative aspect-square overflow-hidden rounded-2xl border transition-all ${selectedMediaIndex === index ? 'border-[#d4af37] scale-[1.03]' : 'border-white/10 hover:border-[#d4af37]/30'} bg-[#111827]`}>
                      {mediaIsVideo ? (
                        <>
                          <video src={media} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/28">
                            <Play className="h-5 w-5 text-white" />
                          </span>
                        </>
                      ) : (
                        <img src={media} alt={`${product.name} view ${index + 1}`} className="h-full w-full object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#dbc6a4]">Premium Edit</span>
                <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#fff7ef]/80">{product.reviewsCount} Reviews</span>
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold text-[#fff7ef] sm:text-5xl lg:text-6xl">{product.name}</h1>
              <p className="max-w-2xl text-base leading-8 text-[#fff7ef]/72">{product.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <motion.span key={displayPrice} initial={{ opacity: 0.5, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-semibold text-[#f7efe5]">{formatMoney(displayPrice)}</motion.span>
              {compareAtPrice ? <span className="text-lg text-[#fff7ef]/35 line-through">{formatMoney(compareAtPrice)}</span> : null}
              <div className="inline-flex items-center gap-1 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-2 text-sm text-[#f8d77d]">
                <Star className="h-4 w-4 fill-current" />
                {product.rating || 4.9}
              </div>
            </div>

            <div className="glass-panel rounded-[28px] p-6 text-[#fff7ef]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#dbc6a4]">Selected option</p>
                  <p className="mt-2 text-lg font-medium">{activeVariantLabel}</p>
                </div>
                <div className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${displayStock > 3 ? 'bg-emerald-500/16 text-emerald-200' : displayStock > 0 ? 'bg-amber-500/16 text-amber-200' : 'bg-rose-500/16 text-rose-200'}`}>
                  {displayStock > 3 ? `${displayStock} in stock` : displayStock > 0 ? `Only ${displayStock} left` : 'Out of stock'}
                </div>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#dbc6a4]">Variants</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(product.variants.length ? product.variants : [{ id: 0, size: null, color: null, material: null, sku: null, stock: product.stock, price: product.salePrice ?? product.price, image: product.image }]).map((variant) => {
                      const resolvedId = variant.id === 0 ? null : variant.id;
                      const isSelected = selectedVariantId === resolvedId;
                      const label = variant.id === 0 ? 'Signature' : buildVariantLabel(variant);
                      return (
                        <button key={variant.id} type="button" onClick={() => setSelectedVariantId(resolvedId)} className={`rounded-full border px-4 py-2 text-sm transition-all ${isSelected ? 'border-[#d4af37] bg-[#d4af37]/12 text-[#f7efe5] shadow-[0_8px_18px_rgba(212,175,55,0.12)]' : 'border-white/12 text-[#fff7ef]/72 hover:border-white/28 hover:bg-white/[0.04]'}`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-white/12 bg-white/5 px-2 py-1">
                    <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="h-10 w-10 rounded-full text-lg text-[#fff7ef]/78 hover:bg-white/8">-</button>
                    <span className="min-w-10 text-center text-sm font-medium">{quantity}</span>
                    <button type="button" onClick={() => setQuantity((prev) => Math.min(displayStock || 1, prev + 1))} className="h-10 w-10 rounded-full text-lg text-[#fff7ef]/78 hover:bg-white/8" disabled={displayStock <= 0}>+</button>
                  </div>
                  <button type="button" onClick={handleWishlist} className={`rounded-full p-3 ${isInWishlist(wishlistKey) ? 'bg-[#d97d68] text-white' : 'border border-white/12 bg-white/5 text-[#fff7ef]'}`}>
                    <Heart className={`h-5 w-5 ${isInWishlist(wishlistKey) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, title: 'Fast dispatch', note: 'Premium packaging' },
                  { icon: ShieldCheck, title: 'Secure checkout', note: 'Protected payments' },
                  { icon: Sparkles, title: 'Luxury finish', note: 'Curated presentation' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-[22px] border border-white/10 bg-white/5 p-4 transition-all hover:-translate-y-1 hover:border-[#d4af37]/24 hover:bg-white/[0.07]">
                      <Icon className="h-5 w-5 text-[#dbc6a4]" />
                      <p className="mt-3 font-medium">{item.title}</p>
                      <p className="mt-1 text-sm text-[#fff7ef]/60">{item.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              {accordionContent.map((item) => {
                const isOpen = openAccordion === item.key;
                const body = item.key === 'details' ? product.description : item.body;
                return (
                  <div key={item.key} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                    <button type="button" onClick={() => setOpenAccordion(isOpen ? '' : item.key)} className="flex w-full items-center justify-between px-5 py-4 text-left text-sm uppercase tracking-[0.22em] text-[#fff7ef]">
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="border-t border-white/10 px-5 py-5 text-sm leading-7 text-[#fff7ef]/72">{body}</div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <section className="mt-20 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Reviews</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#fff7ef] sm:text-4xl">Social proof presented with premium clarity.</h2>
            </div>
            <div className="grid gap-4">
              {(product.reviewEntries.length ? product.reviewEntries : [{ id: 0, name: 'Verified Client', rating: 5, comment: 'Beautiful finish, elevated feel, and a shopping experience that looks genuinely premium.' }]).map((review) => (
                <div key={review.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition-all hover:-translate-y-1 hover:border-[#d4af37]/22 hover:bg-white/[0.07]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#fff7ef]">{review.name}</p>
                      <p className="mt-1 flex items-center gap-1 text-[#d4af37]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={`${review.id}-${index}`} className={`h-4 w-4 ${index < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#dbc6a4]">Verified</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#fff7ef]/72">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Visual review rail</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#fff7ef]">Images and motion that support product confidence.</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {visualReviewMedia.map((media, index) => (
                <div key={`${media}-${index}`} className="overflow-hidden rounded-[22px] border border-white/10 bg-black">
                  {isVideoUrl(media) ? <video src={media} muted playsInline controls className="aspect-[3/4] h-full w-full object-cover" preload="metadata" /> : <img src={media} alt={`${product.name} media ${index + 1}`} className="aspect-[3/4] h-full w-full object-cover" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Related products</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#fff7ef] sm:text-4xl">Continue the premium browsing journey.</h2>
            </div>
            <Link href="/collections" className="inline-flex w-fit rounded-full border border-white/12 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[#fff7ef]/78 hover:border-[#d4af37]/45 hover:text-[#d4af37]">Browse all</Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-2">
            {product.relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="min-w-[280px] flex-1">
                <article className="luxury-card hover-lift rounded-[28px]">
                  <div className="aspect-[4/5] overflow-hidden">
                    <img src={item.image || FALLBACK_PRODUCT_IMAGE} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#dbc6a4]">{item.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#fff7ef]">{item.name}</h3>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-semibold text-[#f7efe5]">{formatMoney(item.salePrice ?? item.price)}</p>
                        {item.salePrice ? <p className="text-sm text-[#fff7ef]/35 line-through">{formatMoney(item.price)}</p> : null}
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#dbc6a4]">
                        {item.rating ? `${item.rating}★` : 'New'}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 rounded-full border border-white/12 bg-[#0b111d]/92 px-4 py-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#dbc6a4]">Ready to purchase</p>
            <p className="mt-1 text-lg font-semibold text-[#fff7ef]">{product.name}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="text-left sm:text-right">
              <p className="text-2xl font-semibold text-[#f7efe5]">{formatMoney(displayPrice)}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-[#fff7ef]/52">Qty {quantity} • {activeVariantLabel}</p>
            </div>
            <button type="button" onClick={handleAddToCart} disabled={displayStock <= 0} className="glow-pulse inline-flex items-center justify-center gap-2 rounded-full bg-[#f7efe5] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#111827] disabled:cursor-not-allowed disabled:opacity-50">
              <ShoppingCart className="h-4 w-4" />
              {displayStock > 0 ? 'Add to cart' : 'Out of stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}