"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';
import CompactCommerceCard from '../ui/CompactCommerceCard';

const bestSellers = [
	{
		id: 'gold-crescent-necklace',
		name: 'Gold Crescent Necklace',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635070/neckles-2_ifgegk.jpg',
		price: 299,
		description: 'Elegant gold necklace with crescent design',
		style: 'modern'
	},
	{
		id: 'navy-velvet-abaya',
		name: 'Navy Velvet Abaya',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635113/suit-20_rquv3r.jpg',
		price: 189,
		description: 'Premium navy velvet abaya for special occasions',
		style: 'traditional'
	},
	{
		id: 'gold-ring-set',
		name: 'Gold Ring Set',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635059/earing-4_umxjjo.jpg',
		price: 149,
		description: 'Classic gold ring with intricate details',
		style: 'classic'
	},
	{
		id: 'diamond-bracelet',
		name: 'Diamond Bracelet',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635043/bracelet-1_eb7gcf.jpg',
		price: 399,
		description: 'Stunning diamond bracelet for luxury look',
		style: 'luxury'
	},
	{
		id: 'kashmiri-bangals',
		name: 'Kashmiri Bangals',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635038/bangals-5_fd7gek.jpg',
		price: 249,
		description: 'Authentic Kashmiri bangles with traditional design',
		style: 'traditional'
	},
	{
		id: 'summer-suit',
		name: 'Summer Suit Set',
		image: 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-3_pfcsvr.jpg',
		price: 199,
		description: 'Light and breezy summer suit collection',
		style: 'modern'
	},
];

export default function BestSellers() {
	const { addToCart } = useCart();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

	return (
		<section className="py-6 px-4 md:px-8 bg-[#0a0a23]">
			<motion.h2 
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
				className="text-3xl md:text-4xl font-bold text-gold mb-6 text-center"
			>
				Best Sellers
			</motion.h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{bestSellers.map((product, idx) => {
					const inWishlist = isInWishlist(product.id);
					return (
					<Link href={`/product/${product.id}`} key={product.id} className="h-full">
						<motion.div
							className="h-full relative group cursor-pointer"
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: idx * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -8 }}
						>
							<CompactCommerceCard
								title={product.name}
								description={product.description}
								image={product.image}
								badge="Best Seller"
								price={`$${product.price}`}
								originalPrice={`$${Math.floor(product.price * 1.2)}`}
								contentPlacement="overlay"
								className="bg-[#1a1a40]"
								mediaOverlay={
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
											<button
												onClick={(e) => {
													e.preventDefault();
													if (inWishlist) {
														removeFromWishlist(product.id);
													} else {
														addToWishlist({ id: product.id, name: product.name, image: product.image, price: product.price });
													}
												}}
												className={`p-3 rounded-full transition transform hover:scale-110 ${
													inWishlist ? 'bg-red-500 text-white' : 'bg-gold text-[#0a0a23] hover:bg-yellow-400'
												}`}
											>
												<Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
											</button>
											<button
												onClick={(e) => {
													e.preventDefault();
													addToCart({ id: product.id, name: product.name, image: product.image, price: product.price, quantity: 1 });
												}}
												className="p-3 rounded-full bg-gold text-[#0a0a23] hover:bg-yellow-400 transition transform hover:scale-110"
											>
												<ShoppingCart className="w-5 h-5" />
											</button>
										</div>
									</div>
								}
							/>
						</motion.div>
					</Link>
				);})}
			</div>
		</section>
	);
}
