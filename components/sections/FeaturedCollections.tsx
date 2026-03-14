"use client";
import { motion } from 'framer-motion';

import { ShoppingCart, Heart } from 'lucide-react';

const collections = [
	{
		title: 'Suit Collection',
		image: '/suit-11.jpeg',
		description: 'Elegant suit for festive occasions.',
		discount: '20% OFF'
	},
	{
		title: 'Bangle Bliss',
		image: '/bangals-4.jpeg',
		description: 'Vibrant bangles for every celebration.',
		discount: '18% OFF'
	},
	{
		title: 'Necklace Dream',
		image: '/neckles-3.jpeg',
		description: 'Enchanting necklace for a royal look.',
		discount: '25% OFF'
	},
	{
		title: 'Earring Perfection',
		image: '/earing-3.jpeg',
		description: 'Classic earrings for timeless beauty.',
		discount: '12% OFF'
	},
	{
		title: 'Bracelet Chic',
		image: '/accessories.jpeg',
		description: 'Stylish bracelet for modern luxury.',
		discount: '15% OFF'
	},
	{
		title: 'Summer Suits',
		image: '/summer-8.jpeg',
		description: 'Fresh summer styles for a vibrant look.',
		discount: '22% OFF'
	},
	{
		title: 'Winter Collection',
		image: '/wintercollection-5.jpeg',
		description: 'Warm up your style with luxurious winter pieces.',
		discount: '30% OFF'
	},
	{
		title: 'Makeup Collection',
		image: '/make-up.jpeg',
		description: 'Premium makeup for every occasion.',
		discount: '10% OFF'
	}
];

export default function FeaturedCollections() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Featured Collections</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{collections.map((collection, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}
						viewport={{ once: true }}
						className="rounded-xl overflow-hidden shadow-lg bg-[#0a0a23] border border-gold relative group"
					>
						<span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow-lg z-20">{collection.discount}</span>
						<div className="relative">
							<img src={collection.image} alt={collection.title} className="w-full h-56 object-cover" />
							<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
								<button className="p-3 rounded-full bg-gold text-[#0a0a23] hover:bg-yellow-400 transition transform hover:scale-110">
									<Heart className="w-5 h-5" />
								</button>
								<button className="p-3 rounded-full bg-gold text-[#0a0a23] hover:bg-yellow-400 transition transform hover:scale-110">
									<ShoppingCart className="w-5 h-5" />
								</button>
							</div>
						</div>
						<div className="p-4 text-center">
							<h3 className="text-lg font-semibold text-gold mb-1">{collection.title}</h3>
							<p className="text-white/70 text-sm">{collection.description}</p>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
