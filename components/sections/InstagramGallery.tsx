"use client";
import { motion } from "framer-motion";

const instagramImages = [
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635077/newcollection-3_tacjvs.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635078/newcollection-4_ijlsmi.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635080/newcollection-5_u8sk9n.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635081/newcollection-6_ogng4l.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635513/summer-5_r3pptq.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635512/summer-4_ga77ea.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635133/suit-33_oy1nkf.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635132/suit-32_gmhzyl.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635113/suit-20_rquv3r.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635075/newcollection-2_xyzabc.jpg",
  "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635076/newcollection-3_xyz123.jpg",
];

// Duplicate for smooth infinite scroll
const loopImages = [...instagramImages, ...instagramImages];

export default function InstagramGallery() {
  return (
    <section className="py-5 px-4 md:px-8 bg-[#1a1a40]">
      <h2 className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-5 text-center">
        Instagram Gallery
      </h2>

      <div className="overflow-hidden border-y border-[#D4AF37]/5 ">
        <div className="insta-track">
          {loopImages.map((img, idx) => (
            <motion.a
              key={`${img}-${idx}`}
              href={img}
              target="_blank"
              rel="noreferrer"
              className="insta-card"
              whileHover={{ y: -8, scale: 1 }}
            >
              <img src={img} alt={`Instagram ${idx + 1}`} className="insta-image" />
            </motion.a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .insta-track {
          display: grid;
          grid-template-rows: repeat(1, 1fr); /* 1 layer */
          grid-auto-flow: column;
          gap: 2px;
          width: max-content;
          animation: scroll 40s linear infinite;
        }

        .insta-card {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(212, 175, 55, 0.4);
          background: #0d1230;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
          transition: all 0.3s ease;
        }

        .insta-card:hover {
          border-color: rgba(212, 175, 55, 0.9);
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.45);
        }

        .insta-image {
          width: 70%;
          height:70%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .insta-card:hover .insta-image {
          transform: scale(1.08);
        }

        /* Zig-zag effect: top row up, bottom row down */
        .insta-card:nth-child(2n + 1) {
          transform: translateY(-8px);
        }

        .insta-card:nth-child(2n) {
          transform: translateY(8px);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .insta-card {
            width: 30px;
            height: 30px;
          }
          .insta-card:nth-child(2n + 1) {
            transform: translateY(-5px);
          }
          .insta-card:nth-child(2n) {
            transform: translateY(5px);
          }
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}