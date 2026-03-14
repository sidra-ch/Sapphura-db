"use client";
import { motion } from 'framer-motion';

const looks = [
	{
		title: 'Gold & Navy Harmony',
		image: '/newcollection-1.jpeg',
		description: 'Pair gold jewelry with navy abaya for a timeless look.'
	},
	{
		title: 'Ramadan Chic',
		image: '/newcollection-2.jpeg',
		description: 'Celebrate Ramadan in style with our exclusive collection.'
	},
	{
		title: 'Summer Breeze',
		image: '/summer-4.jpeg',
		description: 'Light and elegant summer outfit ideas.'
	},
	{
		title: 'Winter Elegance',
		image: '/wintercollection-2.jpeg',
		description: 'Luxurious winter collection for special occasions.'
	}
];

export default function ShopTheLook() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#0a0a23]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Shop The Look</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{looks.map((look, idx) => (
					<motion.div
						key={look.title}
						className="rounded-xl overflow-hidden shadow-lg bg-[#1a1a40] border border-gold flex flex-col items-center"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: idx * 0.1 }}
						viewport={{ once: true }}
					>
						<img src={look.image} alt={look.title} className="w-full h-48 object-cover" />
						<div className="p-4 flex flex-col items-center">
							<h3 className="text-lg font-semibold text-gold mb-1">{look.title}</h3>
							<p className="text-white/70 text-sm mb-2 text-center">{look.description}</p>
							<button className="px-4 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold text-sm hover:bg-yellow-400 transition">Shop This Look</button>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
