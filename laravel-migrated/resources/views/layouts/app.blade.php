<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Sapphura – Luxury Fashion & Jewelry')</title>
    <meta name="description" content="@yield('description', 'Discover luxury jewelry, abayas, and fashion accessories at Sapphura.')">
    <link rel="canonical" href="@yield('canonical', request()->fullUrl())">

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
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Organization JSON-LD --}}
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sapphura",
        "url": "{{ url('/') }}",
        "logo": "{{ asset('/logo-1.png') }}",
        "description": "Luxury fashion, jewelry, and custom stitching services.",
        "sameAs": [
            "https://instagram.com/sapphura",
            "https://facebook.com/sapphura"
        ]
    }
    </script>
    
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
    @include('partials.whatsapp')

    {{-- Alpine.js --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
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
