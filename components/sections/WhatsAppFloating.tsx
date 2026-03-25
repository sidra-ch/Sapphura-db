"use client";

function WhatsAppPhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16.02 4.8C10.04 4.8 5.2 9.55 5.2 15.42C5.2 17.31 5.7 19.16 6.66 20.8L5.05 26.75L11.23 25.18C12.8 26 14.58 26.44 16.4 26.44C22.37 26.44 27.22 21.68 27.22 15.82C27.22 9.95 22.3 4.8 16.02 4.8Z"
        fill="currentColor"
      />
      <path
        d="M23.08 20.47C22.78 21.28 21.35 22 20.63 22.1C19.98 22.19 19.17 22.23 16.42 21.1C12.9 19.65 10.63 16.08 10.45 15.84C10.28 15.61 9.02 13.98 9.02 12.3C9.02 10.63 9.9 9.81 10.21 9.47C10.51 9.14 10.88 9.06 11.08 9.06C11.28 9.06 11.48 9.06 11.64 9.07C11.8 9.08 12.01 9 12.19 9.42C12.41 9.95 12.94 11.63 13.01 11.77C13.08 11.92 13.13 12.11 13.02 12.33C12.92 12.54 12.87 12.67 12.72 12.88C12.56 13.08 12.39 13.33 12.26 13.47C12.1 13.64 11.94 13.83 12.12 14.13C12.29 14.42 12.91 15.42 13.81 16.22C14.98 17.25 15.96 17.56 16.28 17.69C16.59 17.81 16.77 17.79 16.95 17.58C17.13 17.37 17.75 16.67 17.96 16.38C18.17 16.1 18.39 16.15 18.66 16.25C18.94 16.34 20.39 17.05 20.69 17.2C20.99 17.34 21.2 17.41 21.28 17.54C21.37 17.67 21.37 18.32 21.07 19.13C20.77 19.94 19.88 20.65 19.19 20.89"
        fill="#0A1630"
      />
      <path
        d="M16 2.67C8.64 2.67 2.67 8.53 2.67 15.76C2.67 18.24 3.37 20.65 4.68 22.74L2.67 29.33L9.55 27.43C11.53 28.49 13.76 29.04 16.05 29.04C23.37 29.04 29.33 23.19 29.33 15.95C29.33 8.71 23.37 2.67 16 2.67ZM16.05 26.95C14.05 26.95 12.09 26.42 10.37 25.42L9.98 25.19L5.91 26.31L7.09 22.37L6.84 21.97C5.74 20.24 5.16 18.24 5.16 16.17C5.16 10.12 10.08 5.19 16 5.19C21.89 5.19 26.84 10.05 26.84 16.02C26.84 21.98 21.95 26.95 16.05 26.95Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
    </svg>
  );
}

export default function WhatsAppFloating() {
  return (
    <a
      href="https://wa.me/923320924951"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative flex items-center gap-3 rounded-full border border-[#d4af37]/30 bg-[linear-gradient(135deg,rgba(10,22,48,0.96),rgba(18,33,63,0.96))] px-4 py-3 text-[#fff7ef] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#d4af37]/50 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.34)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_22px_rgba(37,211,102,0.28)] transition-transform duration-300 group-hover:scale-105">
          <WhatsAppPhoneIcon className="h-6 w-6" />
        </span>
      
      </span>
    </a>
  );
}
