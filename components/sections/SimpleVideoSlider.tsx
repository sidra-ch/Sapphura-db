"use client";
import React, { useEffect, useRef, useState } from "react";

const media = [
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773004786/clothes-vdo-1_iwxgp4.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1773004785/clothesvdo2_e26nvn.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1772967976/stitchclothes-1_fsnexm.mp4",
  "https://res.cloudinary.com/dwmxdyvd2/video/upload/v1772967957/eid_collection_vnz1ro.mp4",
];

export default function SimpleVideoSlider() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentSrc = media[current];
    if (currentSrc.endsWith('.mp4')) {
      const vid = videoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play();
        vid.onended = () => {
          setCurrent((prev) => (prev + 1) % media.length);
        };
        vid.onerror = () => {
          setCurrent((prev) => (prev + 1) % media.length);
        };
      }
      return () => {
        if (vid) {
          vid.onended = null;
          vid.onerror = null;
        }
      };
    }
  }, [current]);

  return (
    <section className="w-full h-[320px] md:h-[480px] flex items-center justify-center bg-[#0a0a23] mt-12 mb-12">
      {media[current].endsWith('.mp4') ? (
        <video
          ref={videoRef}
          src={media[current]}
          autoPlay
          loop={false}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover rounded-xl border-4 border-gold shadow-xl"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
      ) : (
        <img
          src={media[current]}
          alt={`Sapphura Media ${current + 1}`}
          className="w-full h-full object-cover rounded-xl border-4 border-gold shadow-xl"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
          onLoad={() => setTimeout(() => setCurrent((prev) => (prev + 1) % media.length), 3500)}
        />
      )}
    </section>
  );
}
