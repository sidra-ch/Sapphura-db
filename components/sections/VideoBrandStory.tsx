"use client";
import React from "react";

export default function VideoBrandStory() {
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
          e.currentTarget.play().catch(() => {
            // manual controls remain available
          });
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/60 rounded-xl p-8 md:p-16 shadow-xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gold mb-4 drop-shadow-lg">Behind the Brilliance</h2>
          <p className="text-lg md:text-2xl text-white/90">Discover the story, craftsmanship, and passion behind Sapphura&apos;s luxury collections.</p>
        </div>
      </div>
    </section>
  );
}
