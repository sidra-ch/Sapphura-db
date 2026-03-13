"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppCorner() {
  return (
    <a
      href="https://wa.me/923320924951"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#0a0a23] hover:bg-gold text-gold hover:text-[#0a0a23] px-3 py-2 rounded-full shadow-lg text-sm font-medium border border-gold transition-colors duration-200"
      style={{ boxShadow: "0 2px 12px #0a0a23" }}
    >
      <MessageCircle className="w-5 h-5 text-gold" />
      <span>Chat with us</span>
    </a>
  );
}
