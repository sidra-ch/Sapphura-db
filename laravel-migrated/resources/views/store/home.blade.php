@extends('layouts.app')
@section('title', 'Sapphura — Luxury Fashion & Jewelry')
@section('description', 'Shop luxury jewelry, ready-to-wear fashion, unstitched collections, and custom stitching at Sapphura. Premium quality, nationwide delivery.')

@section('content')

<section x-data="{
    active: 0,
    slides: [
        { label: 'New Collection', title: 'The Signature Edit', copy: 'Explore premium women’s fashion and accessories curated for every elegant occasion.', image: '/summer-1.jpeg', href: '/collections' },
        { label: 'Evening Luxury', title: 'Refined Eveningwear', copy: 'Discover handcrafted silhouettes, statement jewellery and polished beauty essentials.', image: '/neckles-3.jpeg', href: '/collections?search=Evening' },
        { label: 'Modern Heritage', title: 'Wearable Tradition', copy: 'Elevate your wardrobe with modern tailoring and luxury fabrications.', image: '/clothes-collection.jpeg', href: '/collections?category=Clothing' },
        { label: 'Bridal Ready', title: 'Bridal & Festive', copy: 'Celebrate special moments with luminous pieces designed for elegant gatherings.', image: '/newcollection-1.jpeg', href: '/collections?search=Bridal' },
        { label: 'Beauty Edit', title: 'Makeup & Accessories', copy: 'Complete your look with premium makeup, statement jewellery and refined accessories.', image: '/make-up.jpeg', href: '/collections?category=Makeup' }
    ],
    timer: null,
    init() { this.start() },
    start() { this.pause(); this.timer = setInterval(() => this.active = (this.active + 1) % this.slides.length, 6000); },
    pause() { if (this.timer) { clearInterval(this.timer); this.timer = null; } },
    reset() { this.pause(); this.start(); },
    prev() { this.active = (this.active - 1 + this.slides.length) % this.slides.length; this.reset(); },
    next() { this.active = (this.active + 1) % this.slides.length; this.reset(); }
}"
         x-init="init()"
         @mouseenter="pause()"
         @mouseleave="start()"
         class="relative overflow-hidden min-h-[65vh] sm:min-h-[75vh] lg:min-h-[90vh]">
    <template x-for="(slide, index) in slides" :key="slide.title">
        <div x-show="active === index" x-transition.opacity.duration.700 class="absolute inset-0">
            <img :src="slide.image" :alt="slide.title" class="h-full w-full object-cover object-center" loading="lazy">
            <div class="absolute inset-0 bg-navy/65"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"></div>
            <div class="relative z-10 flex h-full items-center">
                <div class="section-shell mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div class="max-w-2xl text-center">
                        <p class="text-[10px] uppercase tracking-[0.45em] text-gold/70 mb-4" x-text="slide.label"></p>
                        <h1 class="text-4xl sm:text-5xl md:text-[4.4rem] leading-tight font-semibold text-cream mb-6" x-text="slide.title"></h1>
                        <p class="text-sm sm:text-base text-cream/70 mb-8" x-text="slide.copy"></p>
                        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a :href="slide.href"
                               class="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-ink transition hover:bg-gold-light">
                                Shop Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <button type="button" @click="prev()"
            class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/20 bg-navy/70 p-3 text-cream transition hover:bg-navy hover:text-gold">
        <span class="sr-only">Previous slide</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <button type="button" @click="next()"
            class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-gold/20 bg-navy/70 p-3 text-cream transition hover:bg-navy hover:text-gold">
        <span class="sr-only">Next slide</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
    </button>

    <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <template x-for="(slide, index) in slides" :key="slide.title + '-dot'">
            <button type="button" @click="active = index; reset();"
                    :class="active === index ? 'bg-gold' : 'bg-cream/30'"
                    class="h-2.5 w-2.5 rounded-full transition"></button>
        </template>
    </div>
</section>

<section class="py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center reveal">
            <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60 md:text-[11px]">Browse Collection</p>
            <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Shop by Category</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 reveal-stagger">
            <a href="/collections?category=Jewelry" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/neckles-3.jpeg" alt="Jewellery" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Necklaces · Earrings · Bracelets</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Jewellery</h3>
                </div>
            </a>
            <a href="/collections?category=Clothing" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/clothes-collection.jpeg" alt="Ready To Wear" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Suits · Dresses · Sets</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Ready To Wear</h3>
                </div>
            </a>
            <a href="/collections?category=Unstitched" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/summer-2.jpeg" alt="Unstitched" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Lawn · Silk · Chiffon</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Unstitched</h3>
                </div>
            </a>
            <a href="/collections?category=Makeup" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/make-up.jpeg" alt="Makeup" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Beauty · Lipsticks · Fragrance</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Makeup</h3>
                </div>
            </a>
        </div>
    </div>
</section>

<section id="new-arrivals" class="border-t border-gold/[0.07] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 flex items-end justify-between gap-4 reveal">
            <div>
                <p class="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.45em] text-gold/55">
                    <span class="h-px w-5 bg-gold/35 inline-block"></span>Just Arrived
                </p>
                <h2 class="text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">New Arrivals</h2>
            </div>
            <a href="/collections?sort=newest" class="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition hover:bg-gold hover:text-ink hover:border-gold">
                See All
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
            </a>
        </div>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5 items-stretch">
            @forelse($latest->take(4) as $product)
                @include('partials.product-card', ['product' => $product])
            @empty
                <a href="/collections?sort=newest" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/newcollection-1.jpeg" alt="New Arrival" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections?sort=newest" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/newcollection-2.jpeg" alt="New Arrival" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections?sort=newest" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/newcollection-3.jpeg" alt="New Arrival" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections?sort=newest" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/newcollection-4.jpeg" alt="New Arrival" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
            @endforelse
        </div>
    </div>
</section>

<section class="border-t border-gold/[0.07] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 flex items-end justify-between gap-4 reveal">
            <div>
                <p class="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.45em] text-gold/55">
                    <span class="h-px w-5 bg-gold/35 inline-block"></span>Curated Selection
                </p>
                <h2 class="text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Featured Collection</h2>
            </div>
            <a href="/collections" class="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition hover:bg-gold hover:text-ink hover:border-gold">
                View All
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
            </a>
        </div>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5 items-stretch">
            @forelse($latest->slice(4, 4) as $product)
                @include('partials.product-card', ['product' => $product])
            @empty
                <a href="/collections" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/summer-6.jpeg" alt="Featured Collection" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/summer-7.jpeg" alt="Featured Collection" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/summer-8.jpeg" alt="Featured Collection" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/summer-9.jpeg" alt="Featured Collection" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
            @endforelse
        </div>
    </div>
</section>

<section class="border-t border-gold/[0.07] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center reveal">
            <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60 md:text-[11px]">Shop the Edit</p>
            <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Designed for Every Wardrobe</h2>
        </div>
        <div class="grid gap-4 lg:grid-cols-4">
            <a href="/collections?category=Clothing" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/summer-9.jpeg" alt="Ready To Wear" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Everyday Luxe</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Ready To Wear</h3>
                </div>
            </a>
            <a href="/collections?search=Luxury" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/newcollection-2.jpeg" alt="Luxury Collection" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Premium Craft</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Luxury Collection</h3>
                </div>
            </a>
            <a href="/collections?category=Jewelry" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/bangals-4.jpeg" alt="Jewellery" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Statement Pieces</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Jewellery</h3>
                </div>
            </a>
            <a href="/collections?category=Makeup" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/make-up.jpeg" alt="Makeup" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Beauty Essentials</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Makeup</h3>
                </div>
            </a>
        </div>
    </div>
</section>

<section class="py-16 md:py-20">
    <div class="section-shell">
        <div class="grid items-center gap-8 lg:grid-cols-2 reveal-left">
            <div>
                <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60">Custom Tailoring</p>
                <h2 class="mt-3 text-3xl font-light leading-tight text-cream md:text-4xl" style="font-family:Georgia,serif;">Perfect Fit, Tailored For You</h2>
                <p class="mt-5 text-sm leading-7 text-cream/55">Choose from our signature designs and experience premium custom stitching with expert craftsmanship and personal styling support.</p>
                <div class="mt-6 flex flex-wrap gap-3">
                    <a href="/stitching" class="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-light">Explore Stitching</a>
                    <a href="/collections?category=Clothing" class="inline-flex items-center gap-2 rounded-full border border-gold/25 px-6 py-3 text-xs uppercase tracking-[0.18em] text-gold transition hover:bg-gold/10">View Ready To Wear</a>
                </div>
            </div>
            <div class="relative overflow-hidden rounded-[2rem] border border-gold/15 bg-ink/20">
                <img src="/suit-9.jpeg" alt="Custom Stitching" class="h-full w-full object-cover object-center min-h-[320px]">
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
            </div>
        </div>
    </div>
</section>

<section class="border-t border-gold/[0.07] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 flex items-end justify-between gap-4 reveal">
            <div>
                <p class="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.45em] text-gold/55">
                    <span class="h-px w-5 bg-gold/35 inline-block"></span>Best Sellers
                </p>
                <h2 class="text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Best Sellers</h2>
            </div>
            <a href="/collections?sort=best_sellers" class="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition hover:bg-gold hover:text-ink hover:border-gold">
                Shop Best Sellers
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
            </a>
        </div>
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5 items-stretch">
            @forelse($featured->take(4) as $product)
                @include('partials.product-card', ['product' => $product])
            @empty
                <a href="/collections?sort=best_sellers" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/bangals-2.jpeg" alt="Best Seller" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections?sort=best_sellers" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/neckles-1.jpeg" alt="Best Seller" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections?sort=best_sellers" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/suit-10.jpeg" alt="Best Seller" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
                <a href="/collections?sort=best_sellers" class="luxury-card rounded-2xl overflow-hidden group">
                    <img src="/make-up.jpeg" alt="Best Seller" class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500">
                </a>
            @endforelse
        </div>
    </div>
</section>

<section class="border-t border-gold/[0.07] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center reveal">
            <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60 md:text-[11px]">Customer Reviews</p>
            <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">What They Say</h2>
        </div>
        <div class="grid gap-4 md:grid-cols-3 reveal-stagger">
            <div class="glass rounded-3xl p-8">
                <div class="mb-5 flex items-center gap-2 text-gold">
                    @for($i=0; $i<5; $i++)
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    @endfor
                </div>
                <p class="text-base font-medium text-cream leading-relaxed">“The craftsmanship is exquisite and the delivery was fast. Every piece feels premium and carefully curated.”</p>
                <p class="mt-6 text-sm uppercase tracking-[0.3em] text-cream/50">Ayesha K.</p>
            </div>
            <div class="glass rounded-3xl p-8">
                <div class="mb-5 flex items-center gap-2 text-gold">
                    @for($i=0; $i<5; $i++)
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    @endfor
                </div>
                <p class="text-base font-medium text-cream leading-relaxed">“From jewelry to outfits, the selection is elevated and every detail feels luxurious.”</p>
                <p class="mt-6 text-sm uppercase tracking-[0.3em] text-cream/50">Sara M.</p>
            </div>
            <div class="glass rounded-3xl p-8">
                <div class="mb-5 flex items-center gap-2 text-gold">
                    @for($i=0; $i<5; $i++)
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    @endfor
                </div>
                <p class="text-base font-medium text-cream leading-relaxed">“Beautiful packaging, excellent service and quality that feels truly luxurious.”</p>
                <p class="mt-6 text-sm uppercase tracking-[0.3em] text-cream/50">Hina R.</p>
            </div>
        </div>
    </div>
</section>

<section class="border-t border-gold/[0.07] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center reveal">
            <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60 md:text-[11px]">Instagram Gallery</p>
            <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Styled On Sapphura</h2>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 reveal-stagger">
            <a href="https://instagram.com/sapphura" target="_blank" class="group overflow-hidden rounded-3xl border border-gold/15">
                <img src="/summer-4.jpeg" alt="Instagram image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            </a>
            <a href="https://instagram.com/sapphura" target="_blank" class="group overflow-hidden rounded-3xl border border-gold/15">
                <img src="/neckles-1.jpeg" alt="Instagram image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            </a>
            <a href="https://instagram.com/sapphura" target="_blank" class="group overflow-hidden rounded-3xl border border-gold/15">
                <img src="/suit-10.jpeg" alt="Instagram image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            </a>
            <a href="https://instagram.com/sapphura" target="_blank" class="group overflow-hidden rounded-3xl border border-gold/15">
                <img src="/newcollection-4.jpeg" alt="Instagram image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            </a>
            <a href="https://instagram.com/sapphura" target="_blank" class="group overflow-hidden rounded-3xl border border-gold/15">
                <img src="/summer-3.jpeg" alt="Instagram image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            </a>
            <a href="https://instagram.com/sapphura" target="_blank" class="group overflow-hidden rounded-3xl border border-gold/15">
                <img src="/bangals-2.jpeg" alt="Instagram image" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
            </a>
        </div>
    </div>
</section>

<section class="border-t border-gold/[0.07] py-16 md:py-20 reveal">
    <div class="section-shell">
        <div class="max-w-2xl mx-auto text-center">
            <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60">Stay In The Loop</p>
            <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Join Our Newsletter</h2>
            <p class="mt-4 text-sm text-cream/60">Get exclusive access to new arrivals, limited drops, and curated styling updates straight to your inbox.</p>
            <form class="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Subscribed ✓'; this.querySelector('input').disabled=true; this.querySelector('button').disabled=true;">
                <label for="newsletter-email" class="sr-only">Email address</label>
                <input id="newsletter-email" type="email" required placeholder="Email address"
                       class="w-full rounded-2xl border border-gold/20 bg-navy/80 px-4 py-3 text-cream placeholder-cream/40 focus:border-gold focus:outline-none text-sm transition">
                <button type="submit" class="rounded-2xl bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-light">Subscribe</button>
            </form>
        </div>
    </div>
</section>

@endsection
