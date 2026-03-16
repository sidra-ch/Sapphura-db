"use client";
import { motion } from 'framer-motion';

const instagramImages = [
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635077/newcollection-3_tacjvs.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635078/newcollection-4_ijlsmi.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635080/newcollection-5_u8sk9n.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635081/newcollection-6_ogng4l.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635513/summer-5_r3pptq.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-4_ga77ea.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg',
	'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635113/suit-20_rquv3r.jpg',
];

export default function InstagramGallery() {
	const loopImages = [...instagramImages, ...instagramImages];

	return (
		<section className="py-4 px-3 md:px-6 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-4xl font-bold text-gold mb-4 text-center">Instagram Gallery</h2>
			<div className="overflow-hidden border-y border-gold/30 py-1">
				<div className="insta-track">
					{loopImages.map((img, idx) => (
						<motion.a
							key={`${img}-${idx}`}
							href={img}
							target="_blank"
							rel="noreferrer"
							className="insta-tile"
							initial={{ opacity: 0.7 }}
							whileHover={{ opacity: 1, y: -2 }}
						>
							<img
								src={img}
								alt={`Instagram ${idx + 1}`}
								className="insta-image"
								onError={(e) => {
									e.currentTarget.src = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635069/neckles-1_rbhzgd.jpg';
								}}
							/>
						</motion.a>
					))}
				</div>
			</div>
			<style jsx>{`
				.insta-track {
					display: flex;
					gap: 0.25rem;
					width: max-content;
					animation: instagram-scroll 34s linear infinite;
				}

				.insta-tile {
					display: block;
					position: relative;
					width: 52px;
					height: 52px;
					flex-shrink: 0;
					border-radius: 0.4rem;
					overflow: hidden;
					border: 1px solid rgba(212, 175, 55, 0.4);
					background: #0d1230;
					transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
					box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
				}

				.insta-tile::after {
					content: '';
					position: absolute;
					inset: 0;
					background: linear-gradient(120deg, transparent 15%, rgba(255, 255, 255, 0.2) 50%, transparent 85%);
					transform: translateX(-120%);
					transition: transform 320ms ease;
					pointer-events: none;
				}

				.insta-tile:hover {
					transform: translateY(-2px) scale(1.03);
					border-color: rgba(212, 175, 55, 0.8);
					box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
				}

				.insta-tile:hover::after {
					transform: translateX(120%);
				}

				.insta-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
					transform: scale(1.02);
					transition: transform 250ms ease;
				}

				.insta-tile:hover .insta-image {
					transform: scale(1.08);
				}

				@media (max-width: 640px) {
					.insta-tile {
						width: 44px;
						height: 44px;
					}
				}

				@keyframes instagram-scroll {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
			`}</style>
		</section>
	);
}
