"use client";
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { ShoppingCart, Heart } from 'lucide-react';
import CompactCommerceCard from '../ui/CompactCommerceCard';
import { FALLBACK_PRODUCT_IMAGE } from '../../lib/media';

type FeaturedItem = {
	id: number;
	title: string;
	image: string;
	description: string;
	discount: string;
	category: string;
};

export default function FeaturedCollections() {
	const [collections, setCollections] = useState<FeaturedItem[]>([]);

	useEffect(() => {
		let isMounted = true;

		async function loadFeatured() {
			try {
				const res = await fetch('/api/products?featured=1&limit=8', { cache: 'no-store' });
				const data = await res.json();
				if (!res.ok || !Array.isArray(data.products)) {
					return;
				}

				let products = data.products;
				if (products.length === 0) {
					const fallbackRes = await fetch('/api/products?limit=8', { cache: 'no-store' });
					const fallbackData = await fallbackRes.json();
					products = Array.isArray(fallbackData.products) ? fallbackData.products : [];
				}

				if (!isMounted) return;

				setCollections(
					products.map((p: { id: number; name: string; image: string; description: string; category: string; slug: string; price: number; salePrice?: number | null }) => ({
						id: p.id,
						title: p.name,
						image: p.image || FALLBACK_PRODUCT_IMAGE,
						description: p.description || 'Featured product from our latest collection.',
						discount: p.salePrice && p.price > p.salePrice
							? `${Math.round(((p.price - p.salePrice) / p.price) * 100)}% OFF`
							: 'Featured',
						category: (p.category || 'all').toLowerCase(),
					}))
				);
			} catch {
				// fail silently and keep section stable
			}
		}

		loadFeatured();
		return () => {
			isMounted = false;
		};
	}, []);

	const visibleCollections = useMemo(() => collections.slice(0, 8), [collections]);

	if (visibleCollections.length === 0) {
		return null;
	}

	return (
		<section className="py-10 px-4 md:px-12 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-4xl font-bold text-gold mb-6 text-center">Featured Collections</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{visibleCollections.map((collection, index) => (
					<Link
						key={collection.id}
						href={`/collections?category=${collection.category}`}
						className="block h-full"
					>
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}
						viewport={{ once: true }}
						className="h-full relative group cursor-pointer"
					>
						<CompactCommerceCard
							title={collection.title}
							description={collection.description}
							image={collection.image}
							badge={collection.discount}
							ctaLabel="Click to view products"
							contentPlacement="overlay"
							className="bg-[#0a0a23] border-gold"
							mediaOverlay={
								<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
									<span className="p-3 rounded-full bg-gold text-[#0a0a23] transition transform hover:scale-110">
										<Heart className="w-5 h-5" />
									</span>
									<span className="p-3 rounded-full bg-gold text-[#0a0a23] transition transform hover:scale-110">
										<ShoppingCart className="w-5 h-5" />
									</span>
								</div>
							}
						/>
					</motion.div>
					</Link>
				))}
			</div>
		</section>
	);
}
