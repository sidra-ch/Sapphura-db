"use client";
import React from "react";

export default function VideoBrandStory() {
  const safePlay = (video: HTMLVideoElement) => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Ignore interruption/autoplay errors; controls stay available.
      });
    }
  };

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden bg-[#0a0a23]">
      <video
        src="https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773642077/eid_collection_vl7lxr.mp4"
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="auto"
        poster="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773635074/newcollection-1_w3fvox.jpg"
        className="w-full h-full object-cover"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        onCanPlay={(e) => {
          safePlay(e.currentTarget);
        }}
      />
      <div className="absolute top-3 left-3 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <div className="bg-black/60 rounded-lg md:rounded-xl p-2.5 sm:p-3 md:p-16 shadow-xl text-left md:text-center max-w-[78vw] sm:max-w-[70vw] md:max-w-3xl">
          <h2 className="text-xs sm:text-sm md:text-5xl font-bold text-gold mb-1 md:mb-4 drop-shadow-lg">Behind the Brilliance</h2>
          <p className="hidden sm:block text-sm md:text-2xl text-white/90">Discover the story, craftsmanship, and passion behind Sapphura&apos;s luxury collections.</p>
        </div>
      </div>
    </section>
  );
}
