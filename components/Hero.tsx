"use client";
import { motion } from 'framer-motion';

export default function Hero() {
	return (
		<section className="relative flex flex-col items-center justify-center h-[60vh] md:h-[80vh] bg-gradient-to-br from-[#0a0a23] to-[#1a1a40] text-center">
			<motion.h1
				className="text-5xl md:text-7xl font-bold text-gold mb-4"
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				Discover Luxury. Shop Sapphura.
			</motion.h1>
			<motion.p
				className="text-lg md:text-2xl text-white/80 mb-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1 }}
			>
				Elevate your style with exclusive collections, curated for elegance.
			</motion.p>
			<motion.button
				className="px-8 py-3 rounded-full bg-gold text-[#0a0a23] font-semibold shadow-lg hover:bg-yellow-400 transition"
				whileHover={{ scale: 1.05 }}
			>
				Shop Now
			</motion.button>
		</section>
	);
}
