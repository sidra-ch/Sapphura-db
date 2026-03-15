"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const videos = [
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773004789/eid_collection_video_dk9q4l.mp4",
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
