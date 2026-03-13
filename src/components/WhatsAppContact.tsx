"use client";
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppContact() {
	return (
		<div className="flex justify-center py-8">
			<a
				href="https://wa.me/923320924951"
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold text-[#0a0a23] font-semibold shadow-lg hover:bg-yellow-400 transition border border-gold text-lg shadcn-button"
				aria-label="WhatsApp Quick Service"
			>
				<FaWhatsapp className="w-7 h-7" />
				Quick WhatsApp Service
			</a>
		</div>
	);
}
