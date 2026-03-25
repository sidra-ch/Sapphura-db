"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';
import { FALLBACK_PRODUCT_IMAGE, getPrimaryImageFromList, isVideoUrl } from '../../lib/media';

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image?: string;
  images: string[];
  price: number;
  salePrice?: number | null;
  category: string;
};

export default function BestSellers() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch('/api/products?limit=8', { cache: 'no-store' });
        const data = await response.json();
        if (!active) return;
        setProducts(Array.isArray(data.products) ? data.products.slice(0, 8) : []);
      } catch {
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section-shell py-24 text-white">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#dbc6a4]">Best sellers</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-semibold text-[#fff7ef] sm:text-5xl">High-conversion cards built for premium discovery.</h2>
        </div>
        <Link href="/collections" className="inline-flex w-fit rounded-full border border-white/12 px-5 py-3 text-sm uppercase tracking-[0.24em] text-[#fff7ef]/84 hover:border-[#d4af37]/45 hover:text-[#d4af37]">
          View All Products
        </Link>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {(isLoading ? Array.from({ length: 8 }).map((_, idx) => ({ id: `skeleton-${idx}` } as Product)) : products).map((product, idx) => {
          if (isLoading) {
            return <div key={product.id} className="h-[420px] animate-pulse rounded-[28px] border border-white/10 bg-white/5" />;
          }

          const inWishlist = isInWishlist(product.slug);
          const mediaItems = Array.isArray(product.images) ? product.images : [];
          const previewImage = product.image || getPrimaryImageFromList(mediaItems) || FALLBACK_PRODUCT_IMAGE;
          const previewVideo = mediaItems.find((item) => isVideoUrl(item));
          const displayPrice = product.salePrice ?? product.price;
          const originalPrice = product.salePrice ? product.price : null;

          return (
            <Link href={`/product/${product.slug}`} key={product.id} className="group h-full">
              <motion.article initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: idx * 0.06 }} viewport={{ once: true, margin: '-50px' }} className="soft-shadow gold-ring flex h-full flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(18,25,40,0.94),rgba(10,15,27,0.98))]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={previewImage} alt={product.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-108" loading="lazy" />
                  {previewVideo ? (
                    <video src={previewVideo} muted playsInline loop className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" preload="metadata" />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,18,0.08),rgba(6,10,18,0.74))]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#fff7ef] backdrop-blur-md">
                    {product.category}
                  </div>
                  <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        if (inWishlist) {
                          removeFromWishlist(product.slug);
                        } else {
                          addToWishlist({ id: product.slug, slug: product.slug, name: product.name, image: previewImage, price: displayPrice });
                        }
                      }}
                      className={`rounded-full p-3 ${inWishlist ? 'bg-[#d97d68] text-white' : 'bg-white text-[#111827] hover:bg-[#f7efe5]'}`}
                    >
                      <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        addToCart({ id: product.slug, slug: product.slug, name: product.name, image: previewImage, price: displayPrice, quantity: 1 });
                      }}
                      className="glow-pulse flex-1 rounded-full bg-[#f7efe5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#111827]"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-semibold text-[#fff7ef]">{product.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#fff7ef]/66">{product.description}</p>
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <div>
                      <p className="text-2xl font-semibold text-[#f7efe5]">${displayPrice.toFixed(0)}</p>
                      {originalPrice ? <p className="text-sm text-[#fff7ef]/38 line-through">${originalPrice.toFixed(0)}</p> : null}
                    </div>
                    <div className="rounded-full border border-[#d4af37]/30 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[#d4af37]">
                      Quick View
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
