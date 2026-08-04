{{-- Ultra-Premium Luxury Header --}}
<div x-data="{
        mobileOpen: false,
        shopOpen: false,
        collectionsOpen: false,
        handleNavClick(event) {
            const link = event.target.closest('a[href]');
            if (!link) return;

            const href = link.getAttribute('href') || '';
            if (!href.startsWith('/')) return;

            this.mobileOpen = false;
            this.shopOpen = false;
            this.collectionsOpen = false;
        }
    }"
    x-effect="document.body.style.overflow = mobileOpen ? 'hidden' : ''"
    @click.capture="handleNavClick($event)"
     class="sticky top-0 z-50">
    <div class="bg-[#051025] border-b border-gold/10">
        <div class="section-shell">
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 py-2 text-[10px] uppercase tracking-[0.35em] text-cream/70">
                <span>Free delivery above Rs.1500</span>
                <span class="hidden sm:inline">•</span>
                <span class="hidden sm:inline">7-day exchange</span>
                <span class="hidden sm:inline">•</span>
                <span class="hidden sm:inline">Premium packaging</span>
            </div>
        </div>
    </div>
    <header class="bg-navy border-b border-gold/10 shadow-xl">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-[60px] sm:h-[68px] lg:h-[78px]">
            <div class="flex items-center gap-3">
                <button @click="mobileOpen = !mobileOpen"
                    class="xl:hidden text-cream hover:text-gold transition p-3 rounded-xl hover:bg-gold/10"
                        aria-label="Toggle menu">
                    <svg x-show="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    <svg x-show="mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>

                <a href="/" class="hidden xl:flex items-center gap-3 group flex-shrink-0">
                    <img src="/logo-1.png" alt="Sapphura"
                         class="w-9 h-9 rounded-full border border-gold/40 object-cover group-hover:border-gold transition-colors duration-300">
                    <span class="text-lg font-bold tracking-[0.25em] text-cream group-hover:text-gold transition-colors font-serif uppercase">SAPPHURA</span>
                </a>
            </div>

            <div class="absolute inset-x-0 flex items-center justify-center xl:static xl:pointer-events-auto pointer-events-none">
                <a href="/" class="xl:hidden flex items-center gap-3 group pointer-events-auto">
                    <img src="/logo-1.png" alt="Sapphura"
                         class="w-9 h-9 rounded-full border border-gold/40 object-cover group-hover:border-gold transition-colors duration-300">
                    <span class="hidden sm:inline text-base font-bold tracking-[0.25em] text-cream group-hover:text-gold transition-colors font-serif uppercase">SAPPHURA</span>
                </a>
            </div>

            <nav class="hidden xl:flex items-center gap-5 2xl:gap-7 mx-4">
                <a href="/" class="inline-flex min-h-[40px] items-center text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    Home
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>

                <div class="relative" @mouseenter="shopOpen = true" @mouseleave="shopOpen = false" @click.outside="shopOpen = false">
                        <button type="button"
                            @click="shopOpen = !shopOpen; collectionsOpen = false"
                            class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group min-h-[40px] py-2 font-medium whitespace-nowrap inline-flex items-center gap-1"
                            aria-expanded="false">
                        Shop
                        <svg class="w-3 h-3 text-gold/70 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>

                    <div x-show="shopOpen" x-cloak
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
                                <a href="/collections?search=Unstitched" class="block text-xs text-cream/70 hover:text-gold transition">Unstitched</a>
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

                <a href="/collections?sort=newest" class="inline-flex min-h-[40px] items-center text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    New Arrivals
                    <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>

                <div class="relative" @mouseenter="collectionsOpen = true" @mouseleave="collectionsOpen = false" @click.outside="collectionsOpen = false">
                        <button type="button"
                            @click="collectionsOpen = !collectionsOpen; shopOpen = false"
                            class="text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group min-h-[40px] py-2 font-medium whitespace-nowrap inline-flex items-center gap-1"
                            aria-expanded="false">
                        Collections
                        <svg class="w-3 h-3 text-gold/70 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>

                    <div x-show="collectionsOpen" x-cloak
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

                <a href="/stitching" class="inline-flex min-h-[40px] items-center text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    Stitching
                </a>
                <a href="/collections?on_sale=1" class="inline-flex min-h-[40px] items-center text-[11px] xl:text-xs uppercase tracking-[0.16em] text-gold hover:text-gold-light transition relative group py-2 font-semibold whitespace-nowrap">
                    Sale
                </a>
                <a href="/about" class="inline-flex min-h-[40px] items-center text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    About
                </a>
                <a href="/contact" class="inline-flex min-h-[40px] items-center text-[11px] xl:text-xs uppercase tracking-[0.16em] text-cream/85 hover:text-gold transition relative group py-2 font-medium whitespace-nowrap">
                    Contact
                </a>
            </nav>

            <div class="flex items-center gap-2.5 sm:gap-4">
                <a href="/search" class="text-cream/80 hover:text-gold transition p-2.5 sm:p-3 rounded-full hover:bg-gold/10" title="Search">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </a>
                <a href="/wishlist" class="relative text-cream/80 hover:text-gold transition p-2.5 sm:p-3 rounded-full hover:bg-gold/10" title="Wishlist">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                      <span x-text="$store.wishlist.totalItems" x-show="$store.wishlist.totalItems > 0" x-cloak
                          class="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"></span>
                </a>
                <button @click="$store.cart.open = true" class="text-cream/80 hover:text-gold transition relative p-2.5 sm:p-3 rounded-full hover:bg-gold/10" title="Cart">
                    <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                      <span x-text="$store.cart.totalItems" x-show="$store.cart.totalItems > 0" x-cloak
                          class="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"></span>
                </button>
                @auth
                    <a href="/account" class="text-cream/80 hover:text-gold transition p-2.5 sm:p-3 rounded-full hover:bg-gold/10" title="Account">
                        <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </a>
                @else
                    <a href="/sign-in" class="hidden xl:inline-flex text-[10px] md:text-xs uppercase tracking-widest text-gold hover:bg-gold hover:text-ink font-semibold border border-gold/40 px-3 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap">Sign In</a>
                @endauth
            </div>
        </div>
    </div>

    <div x-show="mobileOpen" x-cloak
         x-transition:enter="transition ease-out duration-250"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="xl:hidden fixed inset-0 z-50 bg-[#071329]/85 backdrop-blur-md"
         @keydown.escape.window="mobileOpen = false"
         style="display:none;">
        <div class="h-full overflow-y-auto px-5 py-5">
            <div class="mx-auto w-full max-w-md rounded-3xl border border-gold/20 bg-navy/95 shadow-2xl">
            <div class="flex items-center justify-between px-5 py-4 border-b border-gold/15">
                <a href="/" class="text-lg font-bold tracking-[0.25em] text-cream uppercase">SAPPHURA</a>
                <button @click="mobileOpen = false" class="text-cream p-3 rounded-xl hover:bg-gold/10 transition" aria-label="Close menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <nav class="px-4 py-4 space-y-2">
                <a href="/" class="block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">Home</a>
                <div x-data="{ open: false }" class="space-y-2 rounded-xl border border-gold/10 bg-navy-soft/45 p-2">
                    <button @click="open = !open" class="w-full flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">
                        <span>Shop</span>
                        <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div x-show="open" x-transition class="space-y-1 px-2 pb-2">
                        <a href="/collections?category=Clothing" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Ready To Wear</a>
                        <a href="/collections?search=Unstitched" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Unstitched</a>
                        <a href="/collections?search=Luxury" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Luxury Collection</a>
                        <a href="/collections?search=Party" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Party Wear</a>
                        <a href="/collections?category=Jewelry" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Jewellery</a>
                        <a href="/collections?category=Makeup" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Makeup</a>
                        <a href="/collections?search=Accessories" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Accessories</a>
                    </div>
                </div>
                <a href="/collections?sort=newest" class="block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">New Arrivals</a>
                <div x-data="{ open: false }" class="space-y-2 rounded-xl border border-gold/10 bg-navy-soft/45 p-2">
                    <button @click="open = !open" class="w-full flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">
                        <span>Collections</span>
                        <svg :class="open ? 'rotate-180' : ''" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div x-show="open" x-transition class="space-y-1 px-2 pb-2">
                        <a href="/collections?search=Summer" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Summer</a>
                        <a href="/collections?search=Winter" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Winter</a>
                        <a href="/collections?search=Festive" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Festive</a>
                        <a href="/collections?search=Luxury" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Luxury</a>
                        <a href="/collections?search=Bridal" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Bridal</a>
                        <a href="/collections?sort=best_sellers" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Best Sellers</a>
                        <a href="/collections?on_sale=1" class="block rounded-lg px-3 py-2.5 text-[13px] text-cream/70 hover:text-gold hover:bg-gold/10 transition">Sale</a>
                    </div>
                </div>
                <a href="/stitching" class="block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">Stitching</a>
                <a href="/collections?on_sale=1" class="block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-light hover:bg-gold/10 transition">Sale</a>
                <a href="/about" class="block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">About</a>
                <a href="/contact" class="block rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-cream/90 hover:text-gold hover:bg-gold/10 transition">Contact</a>
                @auth
                    <a href="/account" class="block mt-3 rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-light hover:bg-gold/10 transition">My Account</a>
                @else
                    <a href="/sign-in" class="block mt-3 rounded-xl px-3 py-3 text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-light hover:bg-gold/10 transition">Sign In / Register</a>
                @endauth
            </nav>
            </div>
        </div>
    </div>
</header>
</div>
