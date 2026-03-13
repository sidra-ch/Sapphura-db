"use client";
import SocialIcons from './SocialIcons';

export default function Footer() {
	return (
		   <footer className="bg-[#0a0a23] border-t border-gold py-10 text-white">
			   <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-4">
				   <div>
					   <h4 className="text-gold font-bold mb-4">Useful Links</h4>
					   <ul className="space-y-2">
						   <li><a href="/track-order" className="hover:text-gold transition">Track Your Order</a></li>
						   <li><a href="/how-to-order" className="hover:text-gold transition">How To Order</a></li>
						   <li><a href="/shipping-rates" className="hover:text-gold transition">Shipping Rates</a></li>
					   </ul>
				   </div>
				   <div>
					   <h4 className="text-gold font-bold mb-4">Quick Links</h4>
					   <ul className="space-y-2">
						   <li><a href="/bangles" className="hover:text-gold transition">Bangles</a></li>
						   <li><a href="/bracelets" className="hover:text-gold transition">Bracelets</a></li>
						   <li><a href="/necklace-sets" className="hover:text-gold transition">Necklace Sets</a></li>
						   <li><a href="/earrings" className="hover:text-gold transition">Earrings</a></li>
					   </ul>
				   </div>
				   <div>
					   <h4 className="text-gold font-bold mb-4">Company</h4>
					   <ul className="space-y-2">
						   <li><a href="/about" className="hover:text-gold transition">About Us</a></li>
						   <li><a href="/contact" className="hover:text-gold transition">Contact Us</a></li>
						   <li><a href="/blogs" className="hover:text-gold transition">Blogs</a></li>
						   <li><a href="/faqs" className="hover:text-gold transition">FAQs</a></li>
					   </ul>
				   </div>
				   <div>
					   <h4 className="text-gold font-bold mb-4">Policies</h4>
					   <ul className="space-y-2">
						   <li><a href="/refund-policy" className="hover:text-gold transition">Refund Policy</a></li>
						   <li><a href="/exchange-policy" className="hover:text-gold transition">Exchange Policy</a></li>
						   <li><a href="/terms-of-service" className="hover:text-gold transition">Terms of Service</a></li>
					   </ul>
				   </div>
			   </div>
			   <SocialIcons />
			   <div className="mt-6 text-sm text-white/70 text-center">
				   &copy; {new Date().getFullYear()} Sapphura. All rights reserved.
			   </div>
		   </footer>
	);
}
