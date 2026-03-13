"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const videos = [
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/sapphura/videos/video1.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/sapphura/videos/video2.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/sapphura/videos/video3.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/sapphura/videos/video4.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773167208/Download_bkzmxs.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773004777/bangals-vdo2_ctvcek.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1772973004/WhatsApp_Video_2026-03-08_at_5.20.43_PM_bxoap5.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1772967976/stitchclothes-1_fsnexm.mp4",
];

export default function VideoCarousel() {
  return (
    <section className="w-full h-[320px] md:h-[480px] relative bg-[#0a0a23] mt-12 mb-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop
        className="w-full h-full"
      >
        {videos.map((src, idx) => (
          <SwiperSlide key={idx} className="flex items-center justify-center w-full h-full">
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover rounded-xl border-4 border-gold shadow-xl"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
              onCanPlay={e => e.currentTarget.play()}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
