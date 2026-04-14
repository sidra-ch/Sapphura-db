{{-- Sticky Header --}}
<header x-data="{ scrolled: false, mobileOpen: false, megaOpen: false }"
        x-init="window.addEventListener('scroll', () => scrolled = window.scrollY > 20)"
        :class="scrolled ? 'bg-ink/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'"
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16 md:h-20">
            {{-- Mobile menu button --}}
            <button @click="mobileOpen = !mobileOpen" class="md:hidden text-cream hover:text-gold transition">
                <svg x-show="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                <svg x-show="mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            {{-- Logo --}}
            <a href="/" class="flex items-center gap-2 group">
                <img src="/logo-1.png" alt="Sapphura" class="w-10 h-10 rounded-full border-2 border-gold/40 object-cover animate-pulse-glow">
                <span class="text-xl font-bold tracking-widest text-cream group-hover:text-gold transition hidden sm:inline">SAPPHURA</span>
            </a>

            {{-- Desktop Nav --}}
            <nav class="hidden md:flex items-center gap-8">
                <a href="/" class="text-sm tracking-wider uppercase hover:text-gold transition relative group">
                    Home
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                </a>
                <div class="relative" @mouseenter="megaOpen = true" @mouseleave="megaOpen = false">
                    <a href="/collections" class="text-sm tracking-wider uppercase hover:text-gold transition relative group">
                        Shop
                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                    </a>
                    {{-- Mega Menu --}}
                    <div x-show="megaOpen" x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 -translate-y-2"
                         x-transition:enter-end="opacity-100 translate-y-0"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
                         class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] glass rounded-xl p-6 grid grid-cols-4 gap-6" style="display:none;">
                        <div>
                            <h4 class="text-gold text-xs uppercase tracking-widest mb-3 font-bold">Jewelry</h4>
                            <a href="/collections?category=Jewelry" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Necklaces</a>
                            <a href="/collections?category=Jewelry" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Earrings</a>
                            <a href="/collections?category=Jewelry" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Bangles</a>
                            <a href="/collections?category=Jewelry" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Bracelets</a>
                        </div>
                        <div>
                            <h4 class="text-gold text-xs uppercase tracking-widest mb-3 font-bold">Clothing</h4>
                            <a href="/collections?category=Abaya" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Abayas</a>
                            <a href="/collections?category=Clothing" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Suits</a>
                        </div>
                        <div>
                            <h4 class="text-gold text-xs uppercase tracking-widest mb-3 font-bold">Makeup</h4>
                            <a href="/collections?category=Makeup" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Perfumes</a>
                            <a href="/collections?category=Makeup" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Cosmetics</a>
                        </div>
                        <div>
                            <h4 class="text-gold text-xs uppercase tracking-widest mb-3 font-bold">Accessories</h4>
                            <a href="/collections?category=Accessories" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Hair Bands</a>
                            <a href="/collections?category=Accessories" class="block text-sm text-cream/70 hover:text-gold py-1 transition">Brooches</a>
                        </div>
                    </div>
                </div>
                <a href="/about" class="text-sm tracking-wider uppercase hover:text-gold transition relative group">
                    Story
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                </a>
                <a href="/contact" class="text-sm tracking-wider uppercase hover:text-gold transition relative group">
                    Contact
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
                </a>
            </nav>

            {{-- Right Icons --}}
            <div class="flex items-center gap-4">
                <a href="/search" class="hover:text-gold transition" title="Search">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </a>
                <a href="/wishlist" class="hover:text-gold transition relative" title="Wishlist">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    <span x-text="$store.wishlist.totalItems" x-show="$store.wishlist.totalItems > 0"
                          class="absolute -top-2 -right-2 bg-gold text-ink text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"></span>
                </a>
                <button @click="$store.cart.open = true" class="hover:text-gold transition relative" title="Cart">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span x-text="$store.cart.totalItems" x-show="$store.cart.totalItems > 0"
                          class="absolute -top-2 -right-2 bg-gold text-ink text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"></span>
                </button>
                @auth
                    <a href="/account" class="hover:text-gold transition" title="Account">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </a>
                @else
                    <a href="/sign-in" class="text-sm hover:text-gold transition">Sign In</a>
                @endauth
            </div>
        </div>
    </div>

    {{-- Mobile Menu --}}
    <div x-show="mobileOpen" x-transition class="md:hidden glass border-t border-gold/10" style="display:none;">
        <nav class="px-4 py-4 space-y-3">
            <a href="/" class="block text-sm uppercase tracking-wider hover:text-gold transition">Home</a>
            <a href="/collections" class="block text-sm uppercase tracking-wider hover:text-gold transition">Shop</a>
            <a href="/about" class="block text-sm uppercase tracking-wider hover:text-gold transition">Story</a>
            <a href="/contact" class="block text-sm uppercase tracking-wider hover:text-gold transition">Contact</a>
            @auth
                <a href="/account" class="block text-sm uppercase tracking-wider hover:text-gold transition">Account</a>
            @else
                <a href="/sign-in" class="block text-sm uppercase tracking-wider hover:text-gold transition">Sign In</a>
            @endauth
        </nav>
    </div>
</header>
{{-- Spacer for fixed header --}}
<div class="h-16 md:h-20"></div>
