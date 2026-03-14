"use client";
export default function Newsletter() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#0a0a23] flex flex-col items-center">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-6 text-center">Join Our Newsletter</h2>
			<p className="text-white/80 mb-8 text-center max-w-xl">Get exclusive offers, updates, and luxury inspiration delivered to your inbox.</p>
			<form className="flex flex-col md:flex-row gap-4 w-full max-w-md">
				<input
					type="email"
					placeholder="Enter your email"
					className="px-6 py-3 rounded-full bg-[#1a1a40] border border-gold text-white focus:outline-none focus:border-yellow-400 transition w-full shadcn-input"
					required
				/>
				<button
					type="submit"
					className="px-8 py-3 rounded-full bg-gold text-[#0a0a23] font-semibold shadow-lg hover:bg-yellow-400 transition border border-gold shadcn-button"
				>
					Subscribe
				</button>
			</form>
		</section>
	);
}
