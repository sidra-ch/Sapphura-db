<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php
        $allowedCanonicalQueryKeys = ['category', 'search', 'sort', 'on_sale', 'page'];
        $rawQuery = request()->query();
        $canonicalQuery = [];
        foreach ($allowedCanonicalQueryKeys as $key) {
            if (!array_key_exists($key, $rawQuery)) {
                continue;
            }

            $value = $rawQuery[$key];
            if ($value === null || $value === '') {
                continue;
            }

            $canonicalQuery[$key] = $value;
        }

        $defaultCanonical = request()->url() . (!empty($canonicalQuery) ? ('?' . http_build_query($canonicalQuery)) : '');
    @endphp
    <title>@yield('title', 'Sapphura – Luxury Fashion & Jewelry')</title>
    <meta name="description" content="@yield('description', 'Discover luxury jewelry, abayas, and fashion accessories at Sapphura.')">
    <link rel="canonical" href="@yield('canonical', $defaultCanonical)">

    {{-- Open Graph --}}
    <meta property="og:type" content="@yield('og_type', 'website')">
    <meta property="og:title" content="@yield('title', 'Sapphura – Luxury Fashion & Jewelry')">
    <meta property="og:description" content="@yield('description', 'Discover luxury jewelry, abayas, and fashion accessories at Sapphura.')">
    <meta property="og:image" content="@yield('og_image', asset('/logo-1.png'))">
    <meta property="og:url" content="@yield('og_url', request()->fullUrl())">
    <meta property="og:site_name" content="Sapphura">

    {{-- Twitter Card --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="@yield('title', 'Sapphura – Luxury Fashion & Jewelry')">
    <meta name="twitter:description" content="@yield('description', 'Discover luxury jewelry, abayas, and fashion accessories at Sapphura.')">
    <meta name="twitter:image" content="@yield('og_image', asset('/logo-1.png'))">
    
    {{-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    @if (file_exists(public_path('build/manifest.json')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script>
            tailwind = {
                config: {
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
                                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                                serif: ['Cormorant Garamond', 'Georgia', 'serif'],
                            },
                        }
                    }
                }
            }
        </script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            html { scroll-padding-top: 112px; }
            @media (max-width: 1023px) { html { scroll-padding-top: 102px; } }
            @media (max-width: 639px) { html { scroll-padding-top: 94px; } }
            body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #0a1630; color: #fff7ef; }
            h1, h2, h3, .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
            .glass { background: rgba(19, 33, 63, 0.75); backdrop-filter: blur(18px); border: 1px solid rgba(212, 175, 55, 0.18); }
            .gold-glow { box-shadow: 0 0 20px rgba(212, 175, 55, 0.15); }
            .section-shell { max-width: 1280px; margin-left: auto; margin-right: auto; padding-left: 1.25rem; padding-right: 1.25rem; }
            .luxury-card { background: linear-gradient(180deg, rgba(19, 33, 63, 0.65), rgba(9, 17, 31, 0.5)); border: 1px solid rgba(212, 175, 55, 0.14); position: relative; overflow: hidden; }
            .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            .luxury-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(212, 175, 55, 0.05), transparent 50%); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
            .luxury-card:hover::before { opacity: 1; }
            .luxury-card:hover { border-color: rgba(212, 175, 55, 0.32); box-shadow: 0 10px 35px rgba(3, 8, 20, 0.5); }
            @keyframes floatOrb { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-18px) scale(1.05); } }
            .floating-orb { animation: floatOrb 7s ease-in-out infinite; }
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-marquee { animation: marquee 30s linear infinite; }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
            .animate-float { animation: float 7s ease-in-out infinite; }
            @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 8px rgba(212, 175, 55, 0.2); } 50% { box-shadow: 0 0 24px rgba(212, 175, 55, 0.5); } }
            .animate-pulse-glow { animation: pulseGlow 3.4s ease-in-out infinite; }
            @media (min-width: 640px) { .section-shell { padding-left: 2rem; padding-right: 2rem; } }
        </style>
    @endif

    {{-- Organization JSON-LD --}}
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sapphura",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('logo-1.png') }}",
        "description": "Luxury fashion, jewelry, and custom stitching services.",
        "sameAs": [
            "https://instagram.com/sapphura",
            "https://facebook.com/sapphura"
        ]
    }
    </script>

    <style>
        [x-cloak] { display: none !important; }
    </style>
    
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Sapphura",
        "url": "{{ url('/') }}",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "{{ url('/search') }}?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>

    @stack('styles')
</head>
<body class="min-h-screen bg-navy text-cream antialiased font-sans">
    @include('partials.header')

    <main>
        @yield('content')
    </main>

    @include('partials.footer')
    @include('partials.cart-drawer')
    @if (!request()->is('admin') && !request()->is('admin/*'))
        @include('partials.whatsapp')
    @endif

    <script>
        // Fallback: if Alpine isn't bundled in app.js, load CDN version so dropdowns/widgets still work.
        if (typeof window.Alpine === 'undefined') {
            const alpineFallback = document.createElement('script');
            alpineFallback.defer = true;
            alpineFallback.src = 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';
            document.head.appendChild(alpineFallback);
        }
    </script>

    {{-- GSAP + ScrollTrigger --}}
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof gsap === 'undefined') return;
            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray('.reveal').forEach(function(el) {
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true
                    }
                });
            });

            gsap.utils.toArray('.reveal-stagger').forEach(function(container) {
                var children = container.children;
                if (!children.length) return;
                gsap.from(children, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 88%',
                        once: true
                    }
                });
            });

            gsap.utils.toArray('.reveal-left').forEach(function(el) {
                gsap.from(el, {
                    x: -40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true
                    }
                });
            });

            gsap.utils.toArray('.reveal-right').forEach(function(el) {
                gsap.from(el, {
                    x: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true
                    }
                });
            });

            gsap.utils.toArray('.reveal-scale').forEach(function(el) {
                gsap.from(el, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true
                    }
                });
            });
        });
    </script>

    <script>
        document.addEventListener('alpine:init', function() {
            Alpine.store('cart', {
                items: JSON.parse(localStorage.getItem('sapphura_cart') || '[]'),
                open: false,
                get totalItems() {
                    return this.items.reduce(function(sum, i) { return sum + i.quantity; }, 0);
                },
                get totalPrice() {
                    return this.items.reduce(function(sum, i) { return sum + (i.price * i.quantity); }, 0);
                },
                add: function(item) {
                    var existing = this.items.find(function(i) { return i.id === item.id && i.variant === item.variant; });
                    if (existing) {
                        existing.quantity += item.quantity || 1;
                    } else {
                        this.items.push(Object.assign({}, item, { quantity: item.quantity || 1 }));
                    }
                    this.save();
                    this.open = true;
                },
                remove: function(id) {
                    this.items = this.items.filter(function(i) { return i.id !== id; });
                    this.save();
                },
                updateQty: function(id, qty) {
                    var item = this.items.find(function(i) { return i.id === id; });
                    if (item) {
                        item.quantity = Math.max(1, qty);
                        this.save();
                    }
                },
                clear: function() {
                    this.items = [];
                    this.save();
                },
                save: function() {
                    localStorage.setItem('sapphura_cart', JSON.stringify(this.items));
                }
            });

            Alpine.store('wishlist', {
                items: JSON.parse(localStorage.getItem('sapphura_wishlist') || '[]'),
                get totalItems() {
                    return this.items.length;
                },
                toggle: function(item) {
                    var idx = this.items.findIndex(function(i) { return i.id === item.id; });
                    if (idx >= 0) {
                        this.items.splice(idx, 1);
                    } else {
                        this.items.push(item);
                    }
                    this.save();
                },
                has: function(id) {
                    return this.items.some(function(i) { return i.id === id; });
                },
                remove: function(id) {
                    this.items = this.items.filter(function(i) { return i.id !== id; });
                    this.save();
                },
                save: function() {
                    localStorage.setItem('sapphura_wishlist', JSON.stringify(this.items));
                }
            });
        });
    </script>

    @stack('scripts')
</body>
</html>
