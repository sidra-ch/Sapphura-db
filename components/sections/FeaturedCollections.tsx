"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

import { ShoppingCart, Heart } from 'lucide-react';
import CompactCommerceCard from '../ui/CompactCommerceCard';

type FeaturedItem = {
	id: string;
	title: string;
	image: string;
	description: string;
	badge: string;
	href: string;
};

const featuredCollections: FeaturedItem[] = [
	{
		id: 'necklaces',
		title: 'Necklace Sets',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
		description: 'Layered statement sets with bridal shine and festive polish.',
		badge: 'Jewelry',
		href: '/collections?collection=necklaces',
	},
	{
		id: 'earrings',
		title: 'Earrings',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635059/earing-4_umxjjo.jpg',
		description: 'Classic studs and ornate drops for day-to-evening styling.',
		badge: 'Jewelry',
		href: '/collections?collection=earrings',
	},
	{
		id: 'bangles',
		title: 'Bangles',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635038/bangals-5_fd7gek.jpg',
		description: 'Bold stacks and heritage-inspired details with a richer finish.',
		badge: 'Jewelry',
		href: '/collections?collection=bangles',
	},
	{
		id: 'bracelets',
		title: 'Bracelets',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635043/bracelet-1_eb7gcf.jpg',
		description: 'Clean statement pieces that sharpen formal and casual looks.',
		badge: 'Accessories',
		href: '/collections?collection=bracelets',
	},
	{
		id: 'abaya',
		title: 'Abaya Edit',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg',
		description: 'Refined modestwear with richer textures and occasion-ready cuts.',
		badge: 'Abaya',
		href: '/collections?category=abaya',
	},
	{
		id: 'summer',
		title: 'Summer Suits',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-4_ga77ea.jpg',
		description: 'Lightweight silhouettes and brighter palettes for warm days.',
		badge: 'Clothing',
		href: '/collections?collection=summer',
	},
	{
		id: 'winter',
		title: 'Winter Edit',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635130/suit-31_nnxefy.jpg',
		description: 'Heavier drape, layered looks, and polished seasonal styling.',
		badge: 'Clothing',
		href: '/collections?collection=winter',
	},
	{
		id: 'makeup',
		title: 'Beauty Picks',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635081/newcollection-6_ogng4l.jpg',
		description: 'Curated beauty and finishing pieces styled for the full look.',
		badge: 'Makeup',
		href: '/collections?collection=makeup',
	},
];

export default function FeaturedCollections() {
	return (
		<section className="py-10 px-4 md:px-12 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-4xl font-bold text-gold mb-6 text-center">Featured Collections</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{featuredCollections.map((collection, index) => (
					<Link
						key={collection.id}
						href={collection.href}
						prefetch={false}
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
								badge={collection.badge}
							ctaLabel="Explore Collection"
							contentPlacement="overlay"
							mediaOverlay={
								<div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
									<span className="p-2.5 rounded-full bg-gold text-[#0a0a23] transition transform hover:scale-110">
										<Heart className="w-4 h-4" />
									</span>
									<span className="p-2.5 rounded-full bg-gold text-[#0a0a23] transition transform hover:scale-110">
										<ShoppingCart className="w-4 h-4" />
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
