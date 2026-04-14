<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Sapphura – Luxury Fashion & Jewelry')</title>
    <meta name="description" content="@yield('description', 'Discover luxury jewelry, abayas, and fashion accessories at Sapphura.')">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        gold: '#d4af37',
                        'gold-light': '#e8c967',
                        navy: '#0a1630',
                        'navy-soft': '#13213f',
                        sand: '#dbc6a4',
                        ink: '#09111f',
                        cream: '#fff7ef',
                        'cream-dark': '#f7efe5',
                    },
                    fontFamily: {
                        serif: ['Georgia', 'serif'],
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: Georgia, serif; background: #0a1630; color: #fff7ef; }
        .glass { background: rgba(19,33,63,0.7); backdrop-filter: blur(18px); border: 1px solid rgba(212,175,55,0.15); }
        .gold-glow { box-shadow: 0 0 20px rgba(212,175,55,0.15); }
        /* Section shell – centered container */
        .section-shell { max-width: 1240px; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
        @media (min-width: 640px) { .section-shell { padding-left: 1.5rem; padding-right: 1.5rem; } }
        /* Luxury card – dark card with gold border glow */
        .luxury-card { background: linear-gradient(180deg, rgba(18,33,63,0.6), rgba(9,17,31,0.4)); border: 1px solid rgba(212,175,55,0.12); position: relative; overflow: hidden; }
        .luxury-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(212,175,55,0.04), transparent 50%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .luxury-card:hover::before { opacity: 1; }
        .luxury-card:hover { border-color: rgba(212,175,55,0.28); box-shadow: 0 8px 32px rgba(3,8,20,0.4); }
        /* Floating orb animation */
        @keyframes floatOrb { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-18px) scale(1.05); } }
        .floating-orb { animation: floatOrb 7s ease-in-out infinite; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-float { animation: float 7s ease-in-out infinite; }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 8px rgba(212,175,55,0.2); } 50% { box-shadow: 0 0 24px rgba(212,175,55,0.5); } }
        .animate-pulse-glow { animation: pulseGlow 3.4s ease-in-out infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
    @stack('styles')
</head>
<body class="min-h-screen bg-navy text-cream antialiased">
    @include('partials.header')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')
    @include('partials.cart-drawer')
    @include('partials.whatsapp')

    {{-- Welcome Toast / Popup --}}
    <div x-data="welcomeToast()" x-init="init()">
        {{-- Toast 1: Welcome --}}
        <div x-show="showWelcome" x-transition:enter="transition ease-out duration-500"
             x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-300"
             x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-8"
             class="fixed bottom-24 left-6 z-40 max-w-sm" style="display:none;">
            <div class="glass rounded-2xl p-5 shadow-2xl border border-gold/20">
                <button @click="showWelcome = false" class="absolute top-2 right-3 text-cream/40 hover:text-cream text-lg">&times;</button>
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gold text-sm">Welcome to Sapphura! ✨</p>
                        <p class="text-cream/70 text-xs mt-1 leading-relaxed">Discover our exclusive luxury collection — jewelry, abayas & more.</p>
                    </div>
                </div>
            </div>
        </div>

        {{-- Toast 2: Contact us --}}
        <div x-show="showContact" x-transition:enter="transition ease-out duration-500"
             x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-300"
             x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-8"
             class="fixed bottom-24 left-6 z-40 max-w-sm" style="display:none;">
            <div class="glass rounded-2xl p-5 shadow-2xl border border-gold/20">
                <button @click="showContact = false" class="absolute top-2 right-3 text-cream/40 hover:text-cream text-lg">&times;</button>
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-green-400 text-sm">Need Help? We're Online! 💬</p>
                        <p class="text-cream/70 text-xs mt-1 leading-relaxed">For more information, contact us on WhatsApp. We reply within minutes!</p>
                        <a href="https://wa.me/923320924951?text=Hi%20Sapphura%2C%20I%20need%20some%20information%20about%20your%20products."
                           target="_blank"
                           class="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3.5 py-1.5 rounded-full transition-all">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                            Chat Now
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {{-- Toast 3: Offer/promo --}}
        <div x-show="showOffer" x-transition:enter="transition ease-out duration-500"
             x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-300"
             x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-8"
             class="fixed bottom-24 left-6 z-40 max-w-sm" style="display:none;">
            <div class="glass rounded-2xl p-5 shadow-2xl border border-gold/20">
                <button @click="showOffer = false" class="absolute top-2 right-3 text-cream/40 hover:text-cream text-lg">&times;</button>
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/></svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gold text-sm">Free Shipping! 🚚</p>
                        <p class="text-cream/70 text-xs mt-1 leading-relaxed">Enjoy free delivery on orders above Rs. 5,000. Shop now & save!</p>
                        <a href="/collections" class="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-navy bg-gold hover:bg-gold-light px-3.5 py-1.5 rounded-full transition-all">
                            Shop Now →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- Alpine.js for interactivity --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script>
        // Global cart state
        document.addEventListener('alpine:init', () => {
            Alpine.store('cart', {
                items: JSON.parse(localStorage.getItem('sapphura_cart') || '[]'),
                open: false,
                get totalItems() { return this.items.reduce((sum, i) => sum + i.quantity, 0); },
                get totalPrice() { return this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0); },
                add(item) {
                    const existing = this.items.find(i => i.id === item.id && i.variant === item.variant);
                    if (existing) { existing.quantity += item.quantity || 1; }
                    else { this.items.push({ ...item, quantity: item.quantity || 1 }); }
                    this.save(); this.open = true;
                },
                remove(id) { this.items = this.items.filter(i => i.id !== id); this.save(); },
                updateQty(id, qty) {
                    const item = this.items.find(i => i.id === id);
                    if (item) { item.quantity = Math.max(1, qty); this.save(); }
                },
                clear() { this.items = []; this.save(); },
                save() { localStorage.setItem('sapphura_cart', JSON.stringify(this.items)); }
            });

            Alpine.store('wishlist', {
                items: JSON.parse(localStorage.getItem('sapphura_wishlist') || '[]'),
                get totalItems() { return this.items.length; },
                toggle(item) {
                    const idx = this.items.findIndex(i => i.id === item.id);
                    if (idx >= 0) { this.items.splice(idx, 1); } else { this.items.push(item); }
                    this.save();
                },
                has(id) { return this.items.some(i => i.id === id); },
                remove(id) { this.items = this.items.filter(i => i.id !== id); this.save(); },
                save() { localStorage.setItem('sapphura_wishlist', JSON.stringify(this.items)); }
            });
        });
    </script>
    @stack('scripts')
    <script>
        function welcomeToast() {
            return {
                showWelcome: false,
                showContact: false,
                showOffer: false,
                init() {
                    // Show welcome toast after 2 seconds
                    setTimeout(() => { this.showWelcome = true; }, 2000);
                    // Auto-hide welcome after 6s, then show contact toast
                    setTimeout(() => { this.showWelcome = false; }, 8000);
                    setTimeout(() => { this.showContact = true; }, 10000);
                    // Auto-hide contact after 8s, then show offer
                    setTimeout(() => { this.showContact = false; }, 18000);
                    setTimeout(() => { this.showOffer = true; }, 20000);
                    // Auto-hide offer after 8s
                    setTimeout(() => { this.showOffer = false; }, 28000);
                }
            };
        }
    </script>
</body>
</html>
