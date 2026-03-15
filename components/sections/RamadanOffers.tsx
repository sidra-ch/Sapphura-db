"use client";
import { motion } from 'framer-motion';

const offers = [
	   {
		   title: 'Ramadan Gold Set',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569412/neckles-2_nwgwbk.jpg',
		   originalPrice: '$599',
		   discountPrice: '$499',
		   discount: '17% OFF',
		   description: 'Exclusive gold jewelry set for Ramadan.'
	   },
	   {
		   title: 'Luxury Abaya Offer',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569423/suit-30_mm11yj.jpg',
		   originalPrice: '$299',
		   discountPrice: '$249',
		   discount: '16% OFF',
		   description: 'Elegant navy abaya with special pricing.'
	   },
	   {
		   title: 'Elegant Earrings',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569408/earing-2_qbxara.jpg',
		   originalPrice: '$199',
		   discountPrice: '$149',
		   discount: '25% OFF',
		   description: 'Stunning earrings for festive occasions.'
	   },
	   {
		   title: 'Bridal Bangles',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773569401/bangals-2_cosddb.jpg',
		   originalPrice: '$349',
		   discountPrice: '$279',
		   discount: '20% OFF',
		   description: 'Beautiful bangles for bridal look.'
	   }
];

export default function RamadanOffers() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Ramadan Offers</h2>
			   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				   {offers.map((offer, idx) => (
					   <motion.div
						   key={offer.title}
						   className="rounded-xl overflow-hidden shadow-lg bg-[#0a0a23] border border-gold flex flex-col items-center relative"
						   initial={{ opacity: 0, y: 40 }}
						   whileInView={{ opacity: 1, y: 0 }}
						   transition={{ duration: 0.5, delay: idx * 0.1 }}
						   viewport={{ once: true }}
					   >
						   <span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow-lg z-20">{offer.discount}</span>
						   <img src={offer.image} alt={offer.title} className="w-full h-48 object-cover" />
						   <div className="p-4 flex flex-col items-center">
							   <h3 className="text-lg font-semibold text-gold mb-1">{offer.title}</h3>
							   <div className="flex items-center gap-2 mb-1">
								   <span className="text-lg font-bold text-gold">{offer.discountPrice}</span>
								   <span className="text-sm line-through text-white/60">{offer.originalPrice}</span>
							   </div>
							   <p className="text-white/70 text-sm mb-2 text-center">{offer.description}</p>
							   <button className="px-4 py-2 rounded-full bg-gold text-[#0a0a23] font-semibold text-sm hover:bg-yellow-400 transition">Shop Offer</button>
						   </div>
					   </motion.div>
				   ))}
			</div>
		</section>
	);
}
