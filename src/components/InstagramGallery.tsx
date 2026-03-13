"use client";
import { motion } from 'framer-motion';

const instagramImages = [
	'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
	'https://images.unsplash.com/photo-1465101046530-73398c7f1d67?auto=format&fit=crop&w=600&q=80',
];

export default function InstagramGallery() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Instagram Gallery</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{instagramImages.map((img, idx) => (
					<motion.div
						key={img}
						className="rounded-xl overflow-hidden shadow-lg border border-gold"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: idx * 0.2 }}
					>
						<img src={img} alt={`Instagram ${idx + 1}`} className="w-full h-48 object-cover" />
					</motion.div>
				))}
			</div>
		</section>
	);
}
