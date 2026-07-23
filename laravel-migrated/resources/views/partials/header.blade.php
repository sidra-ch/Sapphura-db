{{-- Ultra-Premium Luxury Header --}}
<div x-data="{ mobileOpen: false, shopOpen: false, collectionsOpen: false }"
     class="sticky top-0 z-50">
    <div class="bg-[#051025] border-b border-gold/10">
        <div class="section-shell">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 text-[10px] uppercase tracking-[0.35em] text-cream/70">
                <span>Free delivery on orders above Rs.1500</span>
                <span class="hidden sm:inline">•</span>
                <span>7-day exchange</span>
                <span class="hidden sm:inline">•</span>
                <span>Premium packaging</span>
            </div>
        </div>
    </div>
    <header class="bg-navy border-b border-gold/10 shadow-xl">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-[60px] sm:h-[68px] lg:h-[78px]">
            <div class="flex items-center gap-3">
                <button @click="mobileOpen = !mobileOpen"
                        class="lg:hidden text-cream hover:text-gold transition p-2"
                        aria-label="Toggle menu">
                    <svg x-show="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    <svg x-show="mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>

                <a href="/" class="hidden lg:flex items-center gap-3 group flex-shrink-0">
                    <img src="/logo-1.png" alt="Sapphura"
                         class="w-9 h-9 rounded-full border border-gold/40 object-cover group-hover:border-gold transition-colors duration-300">
                    <span class="text-lg font-bold tracking-[0.25em] text-cream group-hover:text-gold transition-colors font-serif uppercase">SAPPHURA</span>
                </a>
            </div>

            <div class="absolute inset-x-0 flex items-center justify-center lg:static lg:pointer-events-auto pointer-events-none">
                <a href="/" class="lg:hidden flex items-center gap-3 group pointer-events-auto">
                    <img src="/logo-1.png" alt="Sapphura"
                         class="w-9 h-9 rounded-full border border-gold/40 object-cover group-hover:border-gold transition-colors duration-300">
                    <span class="text-base font-bold tracking-[0.25em] text-cream group-hover:text-gold transition-colors font-serif uppercase">SAPPHURA</span>
                </a>
            </div>

            <nav class="hidden lg:flex items-center gap-5 xl:gap-7 mx-4">
                <a href="/" class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    Home
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>

                <div class="relative" @mouseenter="shopOpen = true" @mouseleave="shopOpen = false">
                    <button type="button"
                            class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap inline-flex items-center gap-1"
                            aria-expanded="false">
                        Shop
                        <svg class="w-3 h-3 text-gold/70 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>

                    <div x-show="shopOpen"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 translate-y-2"
                         x-transition:enter-end="opacity-100 translate-y-0"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100 translate-y-0"
                         x-transition:leave-end="opacity-0 translate-y-2"
                         class="absolute top-full left-0 mt-2 w-[680px] rounded-3xl border border-gold/15 bg-navy p-6 shadow-2xl"
                         style="display:none;">
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <a href="/collections?category=Clothing" class="block text-xs text-cream/70 hover:text-gold transition">Ready To Wear</a>
                                <a href="/collections?category=Unstitched" class="block text-xs text-cream/70 hover:text-gold transition">Unstitched</a>
                                <a href="/collections?search=Luxury" class="block text-xs text-cream/70 hover:text-gold transition">Luxury Collection</a>
                            </div>
                            <div class="space-y-3">
                                <a href="/collections?search=Party" class="block text-xs text-cream/70 hover:text-gold transition">Party Wear</a>
                                <a href="/collections?category=Jewelry" class="block text-xs text-cream/70 hover:text-gold transition">Jewellery</a>
                                <a href="/collections?category=Makeup" class="block text-xs text-cream/70 hover:text-gold transition">Makeup</a>
                                <a href="/collections?search=Accessories" class="block text-xs text-cream/70 hover:text-gold transition">Accessories</a>
                            </div>
                        </div>
                    </div>
                </div>

                <a href="/collections?sort=newest" class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    New Arrivals
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>

                <div class="relative" @mouseenter="collectionsOpen = true" @mouseleave="collectionsOpen = false">
                    <button type="button"
                            class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap inline-flex items-center gap-1"
                            aria-expanded="false">
                        Collections
                        <svg class="w-3 h-3 text-gold/70 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>

                    <div x-show="collectionsOpen"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 translate-y-2"
                         x-transition:enter-end="opacity-100 translate-y-0"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100 translate-y-0"
                         x-transition:leave-end="opacity-0 translate-y-2"
                         class="absolute top-full left-0 mt-2 w-[520px] rounded-3xl border border-gold/15 bg-navy p-6 shadow-2xl"
                         style="display:none;">
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-3">
                                <a href="/collections?search=Summer" class="block text-xs text-cream/70 hover:text-gold transition">Summer</a>
                                <a href="/collections?search=Winter" class="block text-xs text-cream/70 hover:text-gold transition">Winter</a>
                                <a href="/collections?search=Festive" class="block text-xs text-cream/70 hover:text-gold transition">Festive</a>
                            </div>
                            <div class="space-y-3">
                                <a href="/collections?search=Luxury" class="block text-xs text-cream/70 hover:text-gold transition">Luxury</a>
                                <a href="/collections?search=Bridal" class="block text-xs text-cream/70 hover:text-gold transition">Bridal</a>
                                <a href="/collections?sort=best_sellers" class="block text-xs text-cream/70 hover:text-gold transition">Best Sellers</a>
                                <a href="/collections?on_sale=1" class="block text-xs text-cream/70 hover:text-gold transition">Sale</a>
                            </div>
                        </div>
                    </div>
                </div>

                <a href="/stitching" class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    Stitching
                </a>
                <a href="/collections?on_sale=1" class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-gold hover:text-gold-light transition relative group py-2 font-semibold whitespace-nowrap">
                    Sale
                </a>
                <a href="/about" class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    About
                </a>
                <a href="/contact" class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    Contact
                </a>
            </nav>

            <div class="flex items-center gap-3.5 sm:gap-4">
                <a href="/search" class="text-cream/80 hover:text-gold transition p-2 rounded-full hover:bg-gold/10" title="Search">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </a>
                <a href="/wishlist" class="text-cream/80 hover:text-gold transition p-2 rounded-full hover:bg-gold/10" title="Wishlist">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    <span x-text="$store.wishlist.totalItems" x-show="$store.wishlist.totalItems > 0"
                          class="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"></span>
                </a>
                <button @click="$store.cart.open = true" class="text-cream/80 hover:text-gold transition relative p-2 rounded-full hover:bg-gold/10" title="Cart">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span x-text="$store.cart.totalItems" x-show="$store.cart.totalItems > 0"
                          class="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"></span>
                </button>
                @auth
                    <a href="/account" class="text-cream/80 hover:text-gold transition p-2 rounded-full hover:bg-gold/10" title="Account">
                        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </a>
                @else
                    <a href="/sign-in" class="hidden lg:inline-flex text-[10px] md:text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-ink font-semibold border border-gold/40 px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap">Sign In</a>
                @endauth
            </div>
        </div>
    </div>

    <div x-show="mobileOpen" x-transition class="lg:hidden fixed inset-0 z-50 bg-navy/98">
        <div class="h-full overflow-y-auto px-6 py-6">
            <div class="flex items-center justify-between mb-8">
                <a href="/" class="text-lg font-bold tracking-[0.25em] text-cream uppercase">SAPPHURA</a>
                <button @click="mobileOpen = false" class="text-cream p-2" aria-label="Close menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <nav class="space-y-4">
                <a href="/" class="block text-sm uppercase tracking-[0.24em] text-cream/90 hover:text-gold transition">Home</a>
                <div x-data="{ open: false }" class="space-y-2">
                    <button @click="open = !open" class="w-full flex items-center justify-between text-left text-sm uppercase tracking-[0.22em] text-cream/90 hover:text-gold transition py-2">
                        <span>Shop</span>
                        <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div x-show="open" x-transition class="space-y-2 pl-4">
                        <a href="/collections?category=Clothing" class="block text-[13px] text-cream/70 hover:text-gold transition">Ready To Wear</a>
                        <a href="/collections?category=Unstitched" class="block text-[13px] text-cream/70 hover:text-gold transition">Unstitched</a>
                        <a href="/collections?search=Luxury" class="block text-[13px] text-cream/70 hover:text-gold transition">Luxury Collection</a>
                        <a href="/collections?search=Party" class="block text-[13px] text-cream/70 hover:text-gold transition">Party Wear</a>
                        <a href="/collections?category=Jewelry" class="block text-[13px] text-cream/70 hover:text-gold transition">Jewellery</a>
                        <a href="/collections?category=Makeup" class="block text-[13px] text-cream/70 hover:text-gold transition">Makeup</a>
                        <a href="/collections?search=Accessories" class="block text-[13px] text-cream/70 hover:text-gold transition">Accessories</a>
                    </div>
                </div>
                <a href="/collections?sort=newest" class="block text-sm uppercase tracking-[0.24em] text-cream/90 hover:text-gold transition">New Arrivals</a>
                <div x-data="{ open: false }" class="space-y-2">
                    <button @click="open = !open" class="w-full flex items-center justify-between text-left text-sm uppercase tracking-[0.22em] text-cream/90 hover:text-gold transition py-2">
                        <span>Collections</span>
                        <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div x-show="open" x-transition class="space-y-2 pl-4">
                        <a href="/collections?search=Summer" class="block text-[13px] text-cream/70 hover:text-gold transition">Summer</a>
                        <a href="/collections?search=Winter" class="block text-[13px] text-cream/70 hover:text-gold transition">Winter</a>
                        <a href="/collections?search=Festive" class="block text-[13px] text-cream/70 hover:text-gold transition">Festive</a>
                        <a href="/collections?search=Luxury" class="block text-[13px] text-cream/70 hover:text-gold transition">Luxury</a>
                        <a href="/collections?search=Bridal" class="block text-[13px] text-cream/70 hover:text-gold transition">Bridal</a>
                        <a href="/collections?sort=best_sellers" class="block text-[13px] text-cream/70 hover:text-gold transition">Best Sellers</a>
                        <a href="/collections?on_sale=1" class="block text-[13px] text-cream/70 hover:text-gold transition">Sale</a>
                    </div>
                </div>
                <a href="/stitching" class="block text-sm uppercase tracking-[0.24em] text-cream/90 hover:text-gold transition">Stitching</a>
                <a href="/collections?on_sale=1" class="block text-sm uppercase tracking-[0.24em] text-gold hover:text-gold-light transition">Sale</a>
                <a href="/about" class="block text-sm uppercase tracking-[0.24em] text-cream/90 hover:text-gold transition">About</a>
                <a href="/contact" class="block text-sm uppercase tracking-[0.24em] text-cream/90 hover:text-gold transition">Contact</a>
                @auth
                    <a href="/account" class="block mt-4 text-sm uppercase tracking-[0.24em] text-gold hover:text-gold-light transition">My Account</a>
                @else
                    <a href="/sign-in" class="block mt-4 text-sm uppercase tracking-[0.24em] text-gold hover:text-gold-light transition">Sign In / Register</a>
                @endauth
            </nav>
        </div>
    </div>
</header>
</div>
