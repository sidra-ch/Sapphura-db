"use client";

export default function ContactMap() {
  return (
    <div className="bg-[#0a1535] p-4 rounded-2xl border border-gold/20">
      <h2 className="text-2xl font-bold text-gold mb-6">Find Us on Map</h2>
      <div className="h-[400px] rounded-xl overflow-hidden">
        <iframe
          title="Sapphura Location"
          src="https://www.google.com/maps?q=33.5651,73.0169&z=15&output=embed"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <a
          href="https://www.google.com/maps/search/?api=1&query=33.5651,73.0169"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-gold/30 px-4 py-2 text-sm font-medium text-gold hover:bg-gold hover:text-[#0a1535]"
        >
          Open in Maps
        </a>
      </div>
    </div>
  );
}
