"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import CompactCommerceCard from '../ui/CompactCommerceCard';

const offers = [
	   {
		   title: 'Ramadan Gold Set',
		   href: '/product/gold-crescent-necklace',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
		   originalPrice: '$599',
		   discountPrice: '$499',
		   discount: '17% OFF',
		   description: 'Exclusive gold jewelry set for Ramadan.'
	   },
	   {
		   title: 'Luxury Abaya Offer',
		   href: '/product/navy-velvet-abaya',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635129/suit-30_gdgbdt.jpg',
		   originalPrice: '$299',
		   discountPrice: '$249',
		   discount: '16% OFF',
		   description: 'Elegant navy abaya with special pricing.'
	   },
	   {
		   title: 'Elegant Earrings',
		   href: '/product/pearl-earrings',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635056/earing-2_rst8xu.jpg',
		   originalPrice: '$199',
		   discountPrice: '$149',
		   discount: '25% OFF',
		   description: 'Stunning earrings for festive occasions.'
	   },
	   {
		   title: 'Bridal Bangles',
		   href: '/product/kashmiri-bangals',
		   image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635036/bangals-2_wjknoh.jpg',
		   originalPrice: '$349',
		   discountPrice: '$279',
		   discount: '20% OFF',
		   description: 'Beautiful bangles for bridal look.'
	   }
];

export default function RamadanOffers() {
	return (
		<section className="py-6 px-4 md:px-8 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-4xl font-bold text-gold mb-6 text-center">Ramadan Offers</h2>
			   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				   {offers.map((offer, idx) => (
					   <Link key={offer.title} href={offer.href} prefetch className="block h-full">
					   <motion.div
						   className="h-full"
						   initial={{ opacity: 0, y: 40 }}
						   whileInView={{ opacity: 1, y: 0 }}
						   transition={{ duration: 0.5, delay: idx * 0.1 }}
						   viewport={{ once: true }}
					   >
						   <CompactCommerceCard
							   title={offer.title}
							   description={offer.description}
							   image={offer.image}
							   badge={offer.discount}
							   price={offer.discountPrice}
							   originalPrice={offer.originalPrice}
							   ctaLabel="Claim Offer"
							   contentPlacement="overlay"
						   />
					   </motion.div>
					   </Link>
				   ))}
			</div>
		</section>
	);
}
