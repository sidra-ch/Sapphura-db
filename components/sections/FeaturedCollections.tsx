"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

import { ShoppingCart, Heart } from 'lucide-react';

const collections = [
	{
		title: 'Suit Collection',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569419/suit-11_z2ihpw.jpg',
		description: 'Elegant suit for festive occasions.',
		discount: '20% OFF',
		category: 'clothing',
		collection: 'suits'
	},
	{
		title: 'Bangle Bliss',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569400/bangals-4_wfwuba.jpg',
		description: 'Vibrant bangles for every celebration.',
		discount: '18% OFF',
		category: 'jewelry',
		collection: 'bangles'
	},
	{
		title: 'Necklace Dream',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569413/neckles-3_xgq3nj.jpg',
		description: 'Enchanting necklace for a royal look.',
		discount: '25% OFF',
		category: 'jewelry',
		collection: 'necklaces'
	},
	{
		title: 'Earring Perfection',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569408/earing-3_neeumu.jpg',
		description: 'Classic earrings for timeless beauty.',
		discount: '12% OFF',
		category: 'jewelry',
		collection: 'earrings'
	},
	{
		title: 'Bracelet Chic',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569400/accessories_vbfxxg.jpg',
		description: 'Stylish bracelet for modern luxury.',
		discount: '15% OFF',
		category: 'accessories',
		collection: 'bracelets'
	},
	{
		title: 'Summer Suits',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569425/summer-8_gzdbou.jpg',
		description: 'Fresh summer styles for a vibrant look.',
		discount: '22% OFF',
		category: 'clothing',
		collection: 'summer'
	},
	{
		title: 'Winter Collection',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569426/wintercollection-5_sg3se9.jpg',
		description: 'Warm up your style with luxurious winter pieces.',
		discount: '30% OFF',
		category: 'clothing',
		collection: 'winter'
	},
	{
		title: 'Makeup Collection',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569411/make-up_lk7how.jpg',
		description: 'Premium makeup for every occasion.',
		discount: '10% OFF',
		category: 'makeup',
		collection: 'makeup'
	}
];

export default function FeaturedCollections() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Featured Collections</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{collections.map((collection, index) => (
					<Link
						key={collection.title}
						href={`/collections?category=${collection.category}&collection=${collection.collection}`}
						className="block"
					>
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}
						viewport={{ once: true }}
						className="rounded-xl overflow-hidden shadow-lg bg-[#0a0a23] border border-gold relative group cursor-pointer hover:-translate-y-1 transition-transform"
					>
						<span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow-lg z-20">{collection.discount}</span>
						<div className="relative">
							<img src={collection.image} alt={collection.title} className="w-full h-56 object-cover" />
							<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
								<span className="p-3 rounded-full bg-gold text-[#0a0a23] transition transform hover:scale-110">
									<Heart className="w-5 h-5" />
								</span>
								<span className="p-3 rounded-full bg-gold text-[#0a0a23] transition transform hover:scale-110">
									<ShoppingCart className="w-5 h-5" />
								</span>
							</div>
						</div>
						<div className="p-4 text-center">
							<h3 className="text-lg font-semibold text-gold mb-1">{collection.title}</h3>
							<p className="text-white/70 text-sm">{collection.description}</p>
							<p className="text-gold text-xs mt-2">Click to view products</p>
						</div>
					</motion.div>
					</Link>
				))}
			</div>
		</section>
	);
}
