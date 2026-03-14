"use client";
import { motion } from 'framer-motion';

const instagramImages = [
	'/newcollection-3.jpeg',
	'/newcollection-4.jpeg',
	'/newcollection-5.jpeg',
	'/newcollection-6.jpeg',
	'/summer-5.jpeg',
	'/summer-6.jpeg',
	'/wintercollection-3.jpeg',
	'/wintercollection-4.jpeg',
];

export default function InstagramGallery() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Instagram Gallery</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{instagramImages.map((img, idx) => (
					<motion.div
						key={idx}
						className="rounded-xl overflow-hidden shadow-lg border border-gold"
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: idx * 0.1 }}
						viewport={{ once: true }}
					>
						<img src={img} alt={`Instagram ${idx + 1}`} className="w-full h-40 object-cover hover:scale-110 transition-transform duration-300" />
					</motion.div>
				))}
			</div>
		</section>
	);
}
