import React from "react";
import Image from 'next/image';
import { motion } from "framer-motion";

export default function ProductGallery({ images }: { images: string[] }) {
  // Demo gallery with zoom and thumbnails
  return (
    <motion.div className="flex flex-col items-center">
      <div className="relative w-full h-[420px] mb-4">
        <Image
          src={images[0]}
          alt="Product"
          width={600}
          height={420}
          className="w-full h-full object-cover rounded-xl border-4 border-gold shadow-lg hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL="/placeholder-blur.png"
          sizes="(max-width: 768px) 100vw, 600px"
          quality={85}
          loading="lazy"
          priority={false}
        />
      </div>
      <div className="flex gap-2">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt="Thumb"
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-lg border border-gold cursor-pointer hover:scale-110 transition-transform duration-200"
            placeholder="blur"
            blurDataURL="/placeholder-blur.png"
            sizes="80px"
            quality={70}
            loading="lazy"
            priority={false}
          />
        ))}
      </div>
    </motion.div>
  );
}
