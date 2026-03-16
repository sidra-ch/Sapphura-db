"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const slides = [
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642077/eid_collection_vl7lxr.mp4",
    title: "Sapphura Signature Collection",
    description: "Discover timeless elegance with our exclusive signature pieces."
  },
  {
    src: "/winter-collection1.jpeg",
    title: "Winter Collection",
    description: "Warm up your style with luxurious winter jewellery."
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642089/video-1_n61vcd.mp4",
    title: "Designer Bangals",
    description: "Experience the beauty of Kashmiri craftsmanship in every bangle."
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635140/summer-2_bykcf3.jpg",
    title: "Royal Glam",
    description: "Shine bright with our royal-inspired glamour collection."
  },
  {
    src: "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642074/eid_collection_video_azi53n.mp4",
    title: "Kashmiri Bangals",
    description: "Elevate your look with our stunning designer bangles collection."
  },
];

function HeroCarousel() {
  return (
    <section className="w-full h-[420px] md:h-[600px] relative bg-[#0a0a23]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              {slide.src.endsWith('.mp4') ? (
                <video
                  src={slide.src}
                  autoPlay
                  loop={false}
                  muted
                  playsInline
                  controls
                  preload="auto"
                  poster="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg"
                  className="w-full h-full object-cover rounded-xl border-4 border-gold shadow-xl"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                  onCanPlay={(e) => {
                    e.currentTarget.play().catch(() => {
                      // ignore autoplay rejections; controls are visible for manual play
                    });
                  }}
                  onError={(e) => {
                    e.currentTarget.poster = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg';
                  }}
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={slide.src}
                  alt={slide.title}
                  className="w-full h-full object-cover rounded-xl border-4 border-gold shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg';
                  }}
                />
              )}
              <div className="absolute top-1/2 right-8 md:right-16 -translate-y-1/2 bg-black/60 rounded-xl p-6 md:p-8 shadow-lg max-w-xs md:max-w-md text-right z-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gold mb-2 drop-shadow-lg">{slide.title}</h2>
                <p className="text-base md:text-lg text-white/90">{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroCarousel;
