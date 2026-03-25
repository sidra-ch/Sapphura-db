"use client";

import { Facebook, Instagram, Mail } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function SocialIcons() {
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/sapphura', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/sapphura', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://tiktok.com/@sapphura', label: 'TikTok' },
  
    { icon: Mail, href: 'mailto:admin@sapphura.com', label: 'Email' },
  ];

  return (
    <div className="mt-8 flex justify-center gap-3">
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold hover:bg-gold hover:text-[#0a0a23] transition"
          aria-label={social.label}
        >
          <social.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
