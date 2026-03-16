"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import CompactCommerceCard from '../ui/CompactCommerceCard';

const looks = [
	{
		title: 'Gold & Navy Harmony',
		href: '/product/gold-crescent-necklace',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg',
		description: 'Pair gold jewelry with navy abaya for a timeless look.'
	},
	{
		title: 'Ramadan Chic',
		href: '/product/bridal-necklace-set',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635075/newcollection-2_y84q01.jpg',
		description: 'Celebrate Ramadan in style with our exclusive collection.'
	},
	{
		title: 'Summer Breeze',
		href: '/product/summer-suit',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-4_ga77ea.jpg',
		description: 'Light and elegant summer outfit ideas.'
	},
	{
		title: 'Winter Elegance',
		href: '/product/winter-collection',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg',
		description: 'Luxurious winter collection for special occasions.'
	}
];

export default function ShopTheLook() {
	return (
		<section className="py-6 px-4 md:px-8 bg-[#0a0a23]">
			<h2 className="text-3xl md:text-4xl font-bold text-gold mb-6 text-center">Shop The Look</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{looks.map((look, idx) => (
					<Link key={look.title} href={look.href} prefetch className="block h-full">
					<motion.div
						className="h-full"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: idx * 0.1 }}
						viewport={{ once: true }}
						whileHover={{ y: -8 }}
					>
						<CompactCommerceCard
							title={look.title}
							description={look.description}
							image={look.image}
							ctaLabel="Shop This Look"
							contentPlacement="overlay"
							className="bg-[#1a1a40]"
						/>
					</motion.div>
					</Link>
				))}
			</div>
		</section>
	);
}
