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
		<section className="py-5 px-4 md:px-8 bg-[#1a1a40]">
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
					gap: 0.5rem;
					width: max-content;
					animation: instagram-scroll 34s linear infinite;
				}

				.insta-tile {
					display: block;
					width: 76px;
					height: 76px;
					flex-shrink: 0;
					border-radius: 0.5rem;
					overflow: hidden;
					border: 1px solid rgba(212, 175, 55, 0.45);
					background: #0d1230;
				}

				.insta-image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				@keyframes instagram-scroll {
					0% { transform: translateX(0); }
					100% { transform: translateX(-50%); }
				}
			`}</style>
		</section>
	);
}
