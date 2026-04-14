@extends('layouts.app')
@section('title', 'Contact Us – Sapphura')

@section('content')
{{-- Hero --}}
<div class="relative py-20 text-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent"></div>
    <div class="absolute top-10 left-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-0 right-1/4 w-56 h-56 bg-gold/3 rounded-full blur-2xl animate-pulse" style="animation-delay:1.5s"></div>
    <div class="relative max-w-3xl mx-auto px-4">
        <p class="text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">We're Here for You</p>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
        <p class="text-cream/60 text-lg max-w-xl mx-auto">Whether you have a question about our products, need styling advice, or want to place a custom order — our team is here to help.</p>
    </div>
</div>

<div class="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
    <div class="grid lg:grid-cols-2 gap-10">
        {{-- Contact Info Cards --}}
        <div class="space-y-5">
            <div class="glass rounded-xl p-6 flex gap-4 hover:border-gold/40 transition-all duration-300 group">
                <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition">
                    <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gold mb-1">Phone / WhatsApp</h3>
                    <p class="text-cream/60 text-sm">+92 332 0924951</p>
                </div>
            </div>

            <div class="glass rounded-xl p-6 flex gap-4 hover:border-gold/40 transition-all duration-300 group">
                <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition">
                    <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gold mb-1">Email</h3>
                    <p class="text-cream/60 text-sm">sapphura@gmail.com</p>
                </div>
            </div>

            <div class="glass rounded-xl p-6 flex gap-4 hover:border-gold/40 transition-all duration-300 group">
                <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition">
                    <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gold mb-1">Address</h3>
                    <p class="text-cream/60 text-sm">Shop #35, Nadir Plaza</p>
                    <p class="text-cream/60 text-sm">5th Road Commercial Market, D Block</p>
                    <p class="text-cream/60 text-sm">Satellite Town, Rawalpindi 46000</p>
                </div>
            </div>

            <div class="glass rounded-xl p-6 flex gap-4 hover:border-gold/40 transition-all duration-300 group">
                <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition">
                    <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                    <h3 class="font-semibold text-gold mb-1">Working Hours</h3>
                    <p class="text-cream/60 text-sm">Mon – Sat: 10:00 AM – 9:00 PM</p>
                    <p class="text-cream/60 text-sm">Sunday: 12:00 PM – 6:00 PM</p>
                </div>
            </div>

            {{-- WhatsApp CTA --}}
            <a href="https://wa.me/923320924951" target="_blank" rel="noopener"
               class="flex items-center gap-3 glass rounded-xl p-6 hover:border-green-500/40 transition-all duration-300 group">
                <div class="w-12 h-12 bg-green-500/15 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-500/25 transition">
                    <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.149-2.868.852.852-2.868-.149-.252A8 8 0 1112 20z"/></svg>
                </div>
                <div>
                    <h3 class="font-semibold text-green-400 mb-0.5">Chat on WhatsApp</h3>
                    <p class="text-cream/50 text-sm">Quick replies, usually within minutes</p>
                </div>
                <svg class="w-5 h-5 text-cream/30 ml-auto group-hover:text-green-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>

        {{-- Contact Form --}}
        <div class="glass rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-gold mb-6">Send Us a Message</h2>
            @if(session('success'))
                <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6 text-sm text-green-300">{{ session('success') }}</div>
            @endif
            <form method="POST" action="/contact" class="space-y-5">
                @csrf
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-cream/70 mb-1.5">First Name</label>
                        <input type="text" name="first_name" required placeholder="John"
                            class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream placeholder-cream/30 focus:border-gold outline-none transition">
                    </div>
                    <div>
                        <label class="block text-sm text-cream/70 mb-1.5">Last Name</label>
                        <input type="text" name="last_name" placeholder="Doe"
                            class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream placeholder-cream/30 focus:border-gold outline-none transition">
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Email</label>
                    <input type="email" name="email" required placeholder="Enter your email address"
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream placeholder-cream/30 focus:border-gold outline-none transition">
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Phone</label>
                    <input type="tel" name="phone" placeholder="+92 300 123 4567"
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream placeholder-cream/30 focus:border-gold outline-none transition">
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Subject</label>
                    <select name="subject"
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition [&>option]:text-black [&>option]:bg-white">
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Product Question">Product Question</option>
                        <option value="Custom Order">Custom Order</option>
                        <option value="Complaint">Complaint</option>
                        <option value="Partnership">Partnership</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Message</label>
                    <textarea name="message" rows="5" required placeholder="How can we help you?"
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream placeholder-cream/30 focus:border-gold outline-none transition resize-none"></textarea>
                </div>
                <button type="submit"
                    class="w-full py-3.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                    Send Message
                </button>
            </form>
        </div>
    </div>

    {{-- Google Map --}}
    <div class="mt-16">
        <h2 class="text-3xl font-bold text-gold mb-8 text-center">Find Us</h2>
        <div class="glass rounded-2xl p-4 overflow-hidden">
            <div class="h-[400px] rounded-xl overflow-hidden">
                <iframe
                    title="Sapphura Location"
                    src="https://www.google.com/maps?q=33.5651,73.0169&z=15&output=embed"
                    class="h-full w-full border-0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <div class="mt-4 flex justify-end">
                <a href="https://www.google.com/maps/search/?api=1&query=33.5651,73.0169"
                   target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-medium text-gold hover:bg-gold hover:text-ink transition-all duration-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    Open in Google Maps
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
