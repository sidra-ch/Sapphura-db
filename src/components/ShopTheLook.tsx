"use client";
import { motion } from 'framer-motion';

const looks = [
	{
		title: 'Gold & Navy Harmony',
		image: 'https://images.unsplash.com/photo-1517841905240-472c3c3d9c6c?auto=format&fit=crop&w=600&q=80',
		description: 'Pair gold jewelry with navy abaya for a timeless look.'
	},
	{
		title: 'Ramadan Chic',
		image: 'https://images.unsplash.com/photo-1465101046530-73398c7f1d67?auto=format&fit=crop&w=600&q=80',
		description: 'Celebrate Ramadan in style with our exclusive collection.'
	}
];

export default function ShopTheLook() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#0a0a23]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Shop The Look</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{looks.map((look, idx) => (
					<motion.div
						key={look.title}
						className="rounded-xl overflow-hidden shadow-lg bg-[#1a1a40] border border-gold flex flex-col items-center"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: idx * 0.2 }}
					>
						<img src={look.image} alt={look.title} className="w-full h-56 object-cover" />
						<div className="p-6 flex flex-col items-center">
							<h3 className="text-xl font-semibold text-gold mb-2">{look.title}</h3>
							<p className="text-white/80 mb-4 text-center">{look.description}</p>
							<button className="px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition">Shop This Look</button>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
