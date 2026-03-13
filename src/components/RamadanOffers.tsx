"use client";
import { motion } from 'framer-motion';

const offers = [
	   {
		   title: 'Ramadan Gold Set',
		   image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
		   originalPrice: '$599',
		   discountPrice: '$499',
		   discount: '17% OFF',
		   description: 'Exclusive gold jewelry set for Ramadan.'
	   },
	   {
		   title: 'Luxury Abaya Offer',
		   image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
		   originalPrice: '$299',
		   discountPrice: '$249',
		   discount: '16% OFF',
		   description: 'Elegant navy abaya with special pricing.'
	   }
];

export default function RamadanOffers() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Ramadan Offers</h2>
			   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				   {offers.map((offer, idx) => (
					   <motion.div
						   key={offer.title}
						   className="rounded-xl overflow-hidden shadow-lg bg-[#0a0a23] border border-gold flex flex-col items-center relative"
						   initial={{ opacity: 0, y: 40 }}
						   animate={{ opacity: 1, y: 0 }}
						   transition={{ duration: 0.6, delay: idx * 0.2 }}
					   >
						   {/* Discount badge */}
						   <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow-lg z-20">{offer.discount}</span>
						   <img src={offer.image} alt={offer.title} className="w-full h-56 object-cover" />
						   <div className="p-6 flex flex-col items-center">
							   <h3 className="text-xl font-semibold text-gold mb-2">{offer.title}</h3>
							   <div className="flex items-center gap-2 mb-2">
								   <span className="text-lg font-bold text-gold">{offer.discountPrice}</span>
								   <span className="text-base line-through text-white/60">{offer.originalPrice}</span>
							   </div>
							   <p className="text-white/80 mb-4 text-center">{offer.description}</p>
							   <button className="px-6 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold shadow hover:bg-yellow-400 transition">Shop Offer</button>
						   </div>
					   </motion.div>
				   ))}
			</div>
		</section>
	);
}
