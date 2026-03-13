import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloating() {
  return (
    <a
      href="https://wa.me/923320924951"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-xl p-4 flex items-center justify-center transition"
      aria-label="WhatsApp Chat"
    >
      <FaWhatsapp className="w-8 h-8" />
    </a>
  );
}
