"use client";
import { motion } from 'framer-motion';

const bestSellers = [
	{
		name: 'Gold Crescent Necklace',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/products/gold-crescent-necklace.jpg',
		price: '$299',
	},
	{
		name: 'Navy Velvet Abaya',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/products/navy-velvet-abaya.jpg',
		price: '$189',
	},
	{
		name: 'Signature Gold Ring',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/sapphura/products/signature-gold-ring.jpg',
		price: '$149',
	},
];

export default function BestSellers() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#0a0a23]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Best Sellers</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				   {bestSellers.map((product, idx) => (
					   <motion.div
						   key={product.name}
						   className="rounded-xl overflow-hidden shadow-lg bg-[#1a1a40] border border-gold flex flex-col items-center relative"
						   initial={{ opacity: 0, y: 40 }}
						   animate={{ opacity: 1, y: 0 }}
						   transition={{ duration: 0.6, delay: idx * 0.2 }}
					   >
						   {/* Best Seller badge */}
						   <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow-lg z-20">Best Seller</span>
						   <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
						   <div className="p-6 flex flex-col items-center">
								 <h3 className="text-xl font-semibold text-gold mb-2 hover:text-yellow-300 transition-colors drop-shadow-lg" style={{textShadow: '0 1px 8px #2a2a2a'}}> {product.name} </h3>
							   <span className="text-lg text-white/80 mb-4">{product.price}</span>
							   <button className="px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition">View Product</button>
						   </div>
					   </motion.div>
				))}
			</div>
		</section>
	);
}
