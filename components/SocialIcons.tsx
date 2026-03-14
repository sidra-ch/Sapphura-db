import { FaInstagram, FaTiktok, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const socialLinks = [
	{
		icon: <FaInstagram className="w-6 h-6" />, url: 'https://instagram.com/sapphura.com', label: 'Instagram'
	},
	{
		icon: <FaTiktok className="w-6 h-6" />, url: 'https://tiktok.com/@sapphura.com', label: 'TikTok'
	},
	{
		icon: <FaFacebookF className="w-6 h-6" />, url: 'https://facebook.com/sapphura.com', label: 'Facebook'
	},
	{
		icon: <FaWhatsapp className="w-6 h-6" />, url: 'https://wa.me/923320924951', label: 'WhatsApp'
	},
];

export default function SocialIcons() {
	return (
		<div className="flex gap-6 justify-center py-6">
			{socialLinks.map((link) => (
				<a
					key={link.label}
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					className="group bg-[#0a0a23] border border-gold rounded-full p-3 hover:bg-gold hover:text-[#0a0a23] transition shadow-lg"
					aria-label={link.label}
				>
					{link.icon}
				</a>
			))}
		</div>
	);
}
