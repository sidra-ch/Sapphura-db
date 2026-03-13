"use client";
import { motion } from 'framer-motion';

import { ShoppingCart, Heart } from 'lucide-react';
import SkeletonCollectionsGrid from './SkeletonCollectionsGrid';

const collections = [
	{
		title: 'Suit 1',
		image: '/suit-1.jpeg',
		description: 'Elegant suit for festive occasions.',
		discount: '20% OFF'
	},
	{
		title: 'Bangle Bliss',
		image: '/bangals-1.jpeg',
		description: 'Vibrant bangles for every celebration.',
		discount: '18% OFF'
	},
	{
		title: 'Necklace Dream',
		image: '/neckles-1.jpeg',
		description: 'Enchanting necklace for a royal look.',
		discount: '25% OFF'
	},
	{
		title: 'Earring Perfection',
		image: '/earing-1.jpeg',
		description: 'Classic earrings for timeless beauty.',
		discount: '12% OFF'
	},
	{
		title: 'Bracelet Chic',
		image: '/bracelet-1.jpeg',
		description: 'Stylish bracelet for modern luxury.',
		discount: '15% OFF'
	},
	{
		title: 'Cloth Collection',
		image: '/cloth collection-5.jpeg',
		description: 'Premium cloth collection for every season.',
		discount: '10% OFF'
	},
	{
		title: 'Summer Collection',
		image: '/summer-1.jpeg',
		description: 'Fresh summer styles for a vibrant look.',
		discount: '22% OFF'
	},
	{
		title: 'Winter Collection',
		image: '/winter-collection1.jpeg',
		description: 'Warm up your style with luxurious winter pieces.',
		discount: '30% OFF'
	}
];

export default function FeaturedCollections() {
	return (
		   <section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			   <h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Featured Collections</h2>
			   {/* Skeleton loader for collections grid */}
			   {/* Replace with real loading state in production */}
			   <SkeletonCollectionsGrid />
			   {/* ...existing code for real collections grid... */}
		</section>
	);
}
