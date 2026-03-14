"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useWishlist } from '../wishlist/WishlistContext';

const bestSellers = [
	{
		id: 'gold-crescent-necklace',
		name: 'Gold Crescent Necklace',
		image: '/neckles-2.jpeg',
		price: 299,
		description: 'Elegant gold necklace with crescent design',
		style: 'modern'
	},
	{
		id: 'navy-velvet-abaya',
		name: 'Navy Velvet Abaya',
		image: '/suit-20.jpeg',
		price: 189,
		description: 'Premium navy velvet abaya for special occasions',
		style: 'traditional'
	},
	{
		id: 'signature-gold-ring',
		name: 'Signature Gold Ring',
		image: '/earing-4.jpeg',
		price: 149,
		description: 'Classic gold ring with intricate details',
		style: 'classic'
	},
	{
		id: 'diamond-bracelet',
		name: 'Diamond Bracelet',
		image: '/clothes-collection.jpeg',
		price: 399,
		description: 'Stunning diamond bracelet for luxury look',
		style: 'luxury'
	},
	{
		id: 'kashmiri-bangals',
		name: 'Kashmiri Bangals',
		image: '/bangals-5.jpeg',
		price: 249,
		description: 'Authentic Kashmiri bangles with traditional design',
		style: 'traditional'
	},
	{
		id: 'summer-suit',
		name: 'Summer Suit Set',
		image: '/summer-9.jpeg',
		price: 199,
		description: 'Light and breezy summer suit collection',
		style: 'modern'
	},
];

export default function BestSellers() {
	const { addToCart } = useCart();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

	return (
		<section className="py-16 px-4 md:px-16 bg-[#0a0a23]">
			<motion.h2 
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				viewport={{ once: true }}
				className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center"
			>
				Best Sellers
			</motion.h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{bestSellers.map((product, idx) => {
					const inWishlist = isInWishlist(product.id);
					return (
					<Link href={`/product/${product.id}`} key={product.id}>
						<motion.div
							className={`rounded-xl overflow-hidden shadow-lg bg-[#1a1a40] border border-gold relative group cursor-pointer ${
								idx % 3 === 0 ? 'md:col-span-1' : idx % 2 === 0 ? 'md:col-span-1' : ''
							}`}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: idx * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -5 }}
						>
							<span className="absolute top-3 left-3 bg-gold text-[#0a0a23] font-bold px-3 py-1 rounded-full text-xs shadow-lg z-20">Best Seller</span>
							<div className="relative overflow-hidden">
								<img 
									src={product.image} 
									alt={product.name} 
									className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" 
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
							<div className="p-5 text-center">
								<h3 className="text-lg font-semibold text-gold mb-1 hover:text-yellow-300 transition-colors">{product.name}</h3>
								<p className="text-white/60 text-sm mb-2">{product.description}</p>
								<div className="flex items-center justify-center gap-2">
									<span className="text-2xl font-bold text-gold">${product.price}</span>
									<span className="text-sm text-white/40 line-through">${Math.floor(product.price * 1.2)}</span>
								</div>
							</div>
						</motion.div>
					</Link>
				);})}
			</div>
		</section>
	);
}
