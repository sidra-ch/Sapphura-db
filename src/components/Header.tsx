import { ShoppingBag, User } from 'lucide-react';
import WhatsAppCorner from './WhatsAppCorner';

export default function Header() {
	return (
		<>
			   <header className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-[#0B1A2F] border-b border-gold shadow-xl">
				   <div className="flex items-center gap-2">
					   <img src="https://res.cloudinary.com/dwmxdyvd2/image/upload/v1773004790/logo-1_gzmux1.png" alt="Sapphura Logo" className="w-14 h-14 rounded-full shadow-lg border-2 border-gold" />
					   <span className="text-3xl md:text-4xl font-extrabold text-gold tracking-widest drop-shadow-lg ml-2">Sapphura</span>
				   </div>
				   <nav className="hidden md:flex gap-6 text-white font-semibold relative">
					   <a href="/" className="hover:text-gold transition">Home</a>
					   <div className="group relative">
						   <a href="/collections" className="hover:text-gold transition">Collections</a>
						   <div className="absolute left-0 top-full mt-2 hidden group-hover:flex flex-col bg-[#081220] border border-gold rounded-xl shadow-xl p-4 min-w-[320px]">
							   <div className="grid grid-cols-2 gap-3">
								   <a href="/category/necklace" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Necklace Sets</a>
								   <a href="/category/earrings" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Earrings</a>
								   <a href="/category/rings" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Rings</a>
								   <a href="/category/bracelets" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Bracelets</a>
								   <a href="/category/bangles" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Bangles</a>
								   <a href="/category/bridal" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Bridal Sets</a>
								   <a href="/category/makeup" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Makeup</a>
								   <a href="/category/clothing" className="text-gold hover:bg-gold/10 rounded px-3 py-2">Clothing</a>
							   </div>
						   </div>
					   </div>
					   <a href="/jewelry" className="hover:text-gold transition">Jewelry</a>
					   <a href="/makeup" className="hover:text-gold transition">Makeup</a>
					   <a href="/clothing" className="hover:text-gold transition">Clothing</a>
					   <a href="/sale" className="hover:text-gold transition">Sale</a>
					   <a href="/blog" className="hover:text-gold transition">Blog</a>
					   <a href="/faq" className="hover:text-gold transition">FAQ</a>
					   <a href="/about" className="hover:text-gold transition">About</a>
					   <a href="/contact" className="hover:text-gold transition">Contact</a>
				   </nav>
				   <div className="flex items-center gap-4">
					   <button className="text-gold hover:text-yellow-400 transition"><span className="sr-only">Search</span><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
					   <a href="/wishlist" className="text-gold hover:text-yellow-400 transition"><span className="sr-only">Wishlist</span><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M20.8 4.6c-1.4-1.3-3.6-1.3-5 0l-.8.8-.8-.8c-1.4-1.3-3.6-1.3-5 0-1.3 1.4-1.3 3.6 0 5l.8.8 5 5 5-5 .8-.8c1.3-1.4 1.3-3.6 0-5z"/></svg></a>
					   <a href="/cart" className="relative text-gold hover:text-yellow-400 transition">
						   <ShoppingBag className="w-6 h-6" />
						   <span className="absolute -top-2 -right-2 bg-gold text-[#0a0a23] rounded-full px-2 text-xs font-bold">0</span>
					   </a>
					   <a href="/account" className="text-gold hover:text-yellow-400 transition"><User className="w-6 h-6" /></a>
					   <a href="https://wa.me/923001234567" target="_blank" rel="noopener" className="text-green-500 hover:text-green-400 transition"><span className="sr-only">WhatsApp</span><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/></svg></a>
				   </div>
			   </header>
			<WhatsAppCorner />
		</>
	);
}
