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
</body>
</html>
