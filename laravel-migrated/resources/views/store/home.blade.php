@extends('layouts.app')
@section('title', 'Sapphura – Luxury Fashion & Jewelry')

@section('content')
{{-- ═══════════════════════════════════════════════════════════════
     HERO CAROUSEL – 3 slides, video/image bg, floating orbs
     ═══════════════════════════════════════════════════════════════ --}}
<section class="relative min-h-[38vh] md:min-h-[46vh] lg:min-h-[54vh] overflow-hidden border-b border-gold/[0.12] bg-ink text-white"
         x-data="{
             slide: 0,
             slides: [
                 { src: '/eid collection.mp4', type:'video', eyebrow:'New Season Edit', title:'Timeless Luxury In Navy And Gold', desc:'Discover signature fashion, jewelry, and premium pieces presented with the calm elegance of Sapphura.', cta:'/collections', cta2:'/about' },
                 { src: '/summer-2.jpeg', type:'image', eyebrow:'Signature Collection', title:'Elegant Pieces For Every Occasion', desc:'A refined collection built around rich color, graceful silhouettes, and premium craftsmanship.', cta:'/collections?category=Clothing', cta2:'/about' },
                 { src: '/video-1.mp4', type:'video', eyebrow:'Premium Edit', title:'Designed To Keep The Product First', desc:'Calm presentation, rich navy surfaces, and gold details that let every product stand out.', cta:'/collections?category=Abaya', cta2:'/about' }
             ]
         }"
         x-init="setInterval(() => slide = (slide + 1) % 3, 5500)">

    {{-- Radial gradient overlay --}}
    <div class="absolute inset-0" style="background: radial-gradient(circle at top right, rgba(212,175,55,0.18), transparent 22%), radial-gradient(circle at bottom left, rgba(19,33,63,0.52), transparent 30%), linear-gradient(180deg, rgba(10,22,48,0.08), rgba(9,17,31,0.6));"></div>
    {{-- Bottom gradient --}}
    <div class="absolute inset-x-0 bottom-0 h-48" style="background: linear-gradient(180deg, rgba(9,17,31,0), rgba(9,17,31,0.7));"></div>

    {{-- Floating Orbs --}}
    <div class="floating-orb absolute left-[7%] top-24 hidden h-24 w-24 rounded-full bg-gold/[0.14] blur-3xl lg:block"></div>
    <div class="floating-orb absolute right-[10%] bottom-20 hidden h-28 w-28 rounded-full bg-navy-soft/[0.46] blur-3xl lg:block" style="animation-delay:1.2s"></div>
    <div class="floating-orb absolute right-[24%] top-24 hidden h-24 w-24 rounded-full bg-gold/10 blur-3xl lg:block" style="animation-delay:2.1s"></div>

    {{-- Background Media (per slide) --}}
    <template x-for="(s, idx) in slides" :key="idx">
        <div x-show="slide === idx"
             x-transition:enter="transition-opacity ease-out duration-700"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="transition-opacity ease-in duration-500"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             class="absolute inset-0">
            <template x-if="s.type === 'video'">
                <video :src="s.src" autoplay muted loop playsinline preload="metadata" class="h-full w-full object-cover"></video>
            </template>
            <template x-if="s.type === 'image'">
                <img :src="s.src" :alt="s.title" class="h-full w-full object-cover">
            </template>
            <div class="absolute inset-0" style="background: linear-gradient(90deg, rgba(6,12,27,0.92) 0%, rgba(6,12,27,0.68) 45%, rgba(6,12,27,0.36) 100%);"></div>
        </div>
    </template>

    {{-- Content Grid --}}
    <div class="section-shell relative z-10 flex min-h-[38vh] md:min-h-[46vh] lg:min-h-[54vh] flex-col justify-center py-8 md:py-9 lg:py-10">
        <div class="grid items-center gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-7">
            {{-- Left: Copy --}}
            <div class="max-w-3xl">
                <template x-for="(s, idx) in slides" :key="'copy-' + idx">
                    <div x-show="slide === idx"
                         x-transition:enter="transition ease-out duration-500"
                         x-transition:enter-start="opacity-0 translate-y-4"
                         x-transition:enter-end="opacity-100 translate-y-0">
                        {{-- Eyebrow --}}
                        <div class="mb-4 flex flex-wrap items-center gap-3">
                            <span class="inline-flex rounded-full border border-white/[0.15] bg-white/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-sand md:px-4 md:py-2 md:text-[11px] md:tracking-[0.38em]"
                                  x-text="s.eyebrow"></span>
                        </div>
                        {{-- Title --}}
                        <h1 class="max-w-4xl text-[2.1rem] font-semibold leading-[1.02] text-cream sm:text-[2.5rem] lg:text-[3.45rem] xl:text-[3.75rem]"
                            x-text="s.title"></h1>
                        {{-- Description --}}
                        <p class="mt-4 max-w-2xl text-sm leading-7 text-cream-dark/80 sm:mt-5 sm:text-base lg:max-w-xl"
                           x-text="s.desc"></p>
                    </div>
                </template>

                {{-- CTAs --}}
                <div class="mt-6 flex flex-wrap gap-3">
                    <a :href="slides[slide].cta" class="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-gold-light sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.22em] transition">
                        Shop Now
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                    <a :href="slides[slide].cta2" class="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.06] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream hover:border-gold/[0.45] hover:bg-white/10 sm:px-6 sm:py-3.5 sm:text-sm sm:tracking-[0.22em] transition">
                        Explore Story
                    </a>
                </div>

                {{-- Hero Notes --}}
                <div class="mt-6 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sand sm:gap-3 sm:text-[11px] sm:tracking-[0.28em]">
                    <span class="rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 sm:px-4 sm:py-2">Navy and gold identity</span>
                    <span class="rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 sm:px-4 sm:py-2">Premium product focus</span>
                    <span class="rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 sm:px-4 sm:py-2">Calm luxury presentation</span>
                </div>
            </div>

            {{-- Right: Floating Preview Card (desktop) --}}
            <div class="hidden lg:block">
                <div class="relative mx-auto max-w-[340px] xl:max-w-[380px]">
                    <div class="absolute -left-4 top-7 h-24 w-24 rounded-full bg-gold/[0.14] blur-3xl"></div>
                    <div class="absolute right-0 bottom-10 h-24 w-24 rounded-full bg-navy-soft/50 blur-3xl"></div>
                    <div class="relative overflow-hidden rounded-[30px] border border-gold/[0.16] p-3 shadow-[0_24px_60px_rgba(3,8,20,0.28)]"
                         style="background: linear-gradient(180deg, rgba(18,33,63,0.5), rgba(9,17,31,0.3));">
                        <div class="overflow-hidden rounded-[24px] border border-white/10 bg-[#0b1326]">
                            <template x-for="(s, idx) in slides" :key="'card-' + idx">
                                <div x-show="slide === idx"
                                     x-transition:enter="transition-opacity ease-out duration-700"
                                     x-transition:enter-start="opacity-0"
                                     x-transition:enter-end="opacity-100">
                                    <template x-if="s.type === 'video'">
                                        <video :src="s.src" autoplay muted loop playsinline preload="metadata" class="aspect-[4/5] w-full object-cover"></video>
                                    </template>
                                    <template x-if="s.type === 'image'">
                                        <img :src="s.src" :alt="s.title" class="aspect-[4/5] w-full object-cover">
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div class="pointer-events-none absolute inset-3 rounded-[24px] border border-white/[0.08]"></div>
                        <div class="absolute bottom-6 left-6 rounded-full border border-gold/[0.18] bg-ink/[0.78] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[#f2de97] backdrop-blur-md">
                            Sapphura Signature
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Bottom bar: tagline + slide dots --}}
        <div class="mt-6 flex items-center justify-between gap-4 sm:mt-7">
            <div class="hidden text-[10px] uppercase tracking-[0.22em] text-sand sm:block md:text-[11px] md:tracking-[0.28em]">
                Crafted for modern luxury
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <template x-for="(s, idx) in slides" :key="'dot-' + idx">
                    <button @click="slide = idx"
                            :class="slide === idx ? 'h-2.5 w-12 bg-gold sm:w-14' : 'h-2.5 w-6 bg-white/25 hover:bg-white/[0.45] sm:w-7'"
                            class="rounded-full transition-all"
                            :aria-label="'Go to slide ' + (idx + 1)"></button>
                </template>
            </div>
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     LUXURY FRAMEWORK – 4 feature cards
     ═══════════════════════════════════════════════════════════════ --}}
<section class="border-b border-gold/[0.08] bg-ink py-14 md:py-16">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">The Sapphura Framework</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Built On Calm Luxury</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @foreach([
                ['icon' => '♛', 'title' => 'Navy & Gold Identity', 'desc' => 'A refined color system that signals trust, elegance, and premium quality across every touchpoint.'],
                ['icon' => '✦', 'title' => 'Signature Aesthetics', 'desc' => 'Subtle gradients, gold accents, and quiet details that enhance product focus without distraction.'],
                ['icon' => '⚡', 'title' => 'Premium Delivery', 'desc' => 'Nationwide shipping with careful packaging designed to make unboxing feel like unwrapping a gift.'],
                ['icon' => '🛡', 'title' => 'Trusted Quality', 'desc' => 'Every piece is quality-checked and backed by a satisfaction guarantee with easy exchange support.'],
            ] as $feature)
                <div class="luxury-card group rounded-2xl p-6 transition-all hover:-translate-y-1.5">
                    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/[0.08] text-xl text-gold">
                        {{ $feature['icon'] }}
                    </div>
                    <h3 class="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-cream">{{ $feature['title'] }}</h3>
                    <p class="text-xs leading-relaxed text-cream/60">{{ $feature['desc'] }}</p>
                </div>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     CATEGORY CARDS – with Cloudinary images
     ═══════════════════════════════════════════════════════════════ --}}
<section class="py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Browse Collection</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Explore By Category</h2>
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            @foreach([
                ['name' => 'Jewelry', 'img' => '/neckles-3.jpeg', 'tag' => 'Rings · Necklaces · Earrings'],
                ['name' => 'Clothing', 'img' => '/summer-1.jpeg', 'tag' => 'Suits · Formals · Casuals'],
                ['name' => 'Abaya', 'img' => '/suit-5.jpeg', 'tag' => 'Premium · Classic · Embroidered'],
                ['name' => 'Makeup', 'img' => '/make-up.jpeg', 'tag' => 'Lipsticks · Perfumes · Skincare'],
            ] as $cat)
                <a href="/collections?category={{ urlencode($cat['name']) }}" class="luxury-card group relative overflow-hidden rounded-2xl">
                    <div class="aspect-[3/4] overflow-hidden">
                        <img src="{{ $cat['img'] }}" alt="{{ $cat['name'] }}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-5">
                        <p class="text-[10px] uppercase tracking-[0.28em] text-sand/80">{{ $cat['tag'] }}</p>
                        <h3 class="mt-1 text-lg font-semibold text-cream">{{ $cat['name'] }}</h3>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     MARQUEE STRIP
     ═══════════════════════════════════════════════════════════════ --}}
<section class="border-y border-gold/[0.08] overflow-hidden py-5">
    <div class="animate-marquee flex gap-6 whitespace-nowrap">
        @foreach(['SAPPHURA', 'SIGNATURE EDIT', 'PREMIUM QUALITY', 'NAVY & GOLD', 'LUXURY FASHION', 'CRAFTED WITH CARE', 'SAPPHURA', 'SIGNATURE EDIT', 'PREMIUM QUALITY', 'NAVY & GOLD', 'LUXURY FASHION', 'CRAFTED WITH CARE'] as $item)
            <span class="flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-cream/30">
                <span class="h-1.5 w-1.5 rounded-full bg-gold/40"></span>
                {{ $item }}
            </span>
        @endforeach
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     BEST SELLERS
     ═══════════════════════════════════════════════════════════════ --}}
<section class="py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Curated Selection</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Best Sellers</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach($featured as $product)
                @include('partials.product-card', ['product' => $product])
            @endforeach
        </div>
        <div class="text-center mt-10">
            <a href="/collections" class="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.06] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream hover:border-gold/[0.45] hover:bg-white/10 transition">
                View All Products
            </a>
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     BRAND STORY – image with video hover + stats
     ═══════════════════════════════════════════════════════════════ --}}
<section class="border-t border-gold/[0.08] py-16 md:py-20">
    <div class="section-shell">
        <div class="grid items-center gap-10 lg:grid-cols-2">
            {{-- Media side --}}
            <div class="group relative overflow-hidden rounded-3xl border border-gold/[0.12]" x-data="{ hover: false }" @mouseenter="hover = true" @mouseleave="hover = false">
                <img src="/summer-2.jpeg" alt="Sapphura brand story" class="aspect-[4/3] w-full object-cover transition-opacity duration-500" :class="hover ? 'opacity-0' : 'opacity-100'">
                <video src="/eid collection.mp4" autoplay muted loop playsinline preload="metadata"
                       class="absolute inset-0 aspect-[4/3] w-full object-cover transition-opacity duration-500"
                       :class="hover ? 'opacity-100' : 'opacity-0'"></video>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4 flex gap-2">
                    <span class="rounded-full border border-gold/20 bg-ink/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold backdrop-blur-md">Hover to play</span>
                </div>
            </div>
            {{-- Copy side --}}
            <div>
                <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Our Story</p>
                <h2 class="mt-3 text-2xl font-semibold leading-tight text-cream md:text-3xl lg:text-4xl">Crafting Elegance<br>Since Day One</h2>
                <p class="mt-5 text-sm leading-7 text-cream/60">At Sapphura, we believe every woman deserves to feel extraordinary. Our collections are crafted with passion, blending traditional artistry with modern design to create pieces that tell your unique story.</p>
                <div class="mt-6 flex flex-wrap gap-2">
                    <span class="rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold">Luxury First</span>
                    <span class="rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold">Premium Quality</span>
                    <span class="rounded-full border border-gold/20 bg-gold/[0.08] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold">Trusted Brand</span>
                </div>
                <div class="mt-8 grid grid-cols-3 gap-6">
                    <div><p class="text-2xl font-bold text-gold">10K+</p><p class="text-[10px] uppercase tracking-[0.18em] text-cream/40 mt-1">Happy Customers</p></div>
                    <div><p class="text-2xl font-bold text-gold">500+</p><p class="text-[10px] uppercase tracking-[0.18em] text-cream/40 mt-1">Products</p></div>
                    <div><p class="text-2xl font-bold text-gold">50+</p><p class="text-[10px] uppercase tracking-[0.18em] text-cream/40 mt-1">Collections</p></div>
                </div>
                <a href="/about" class="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-gold-light transition">
                    Read Full Story
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     NEW ARRIVALS
     ═══════════════════════════════════════════════════════════════ --}}
<section class="border-t border-gold/[0.08] py-16 md:py-20">
    <div class="section-shell">
        <div class="mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Just In</p>
            <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">New Arrivals</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach($latest as $product)
                @include('partials.product-card', ['product' => $product])
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════════════════════
     TESTIMONIALS + NEWSLETTER
     ═══════════════════════════════════════════════════════════════ --}}
<section class="relative border-t border-gold/[0.08] py-16 md:py-20 overflow-hidden">
    {{-- Background image --}}
    <div class="absolute inset-0">
        <img src="/summer-2.jpeg" alt="" class="h-full w-full object-cover opacity-[0.08]">
    </div>
    <div class="section-shell relative z-10">
        <div class="grid gap-8 lg:grid-cols-2">
            {{-- Testimonials --}}
            <div>
                <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">What They Say</p>
                <h2 class="mt-2 mb-8 text-2xl font-semibold text-cream md:text-3xl">Customer Love</h2>
                <div class="space-y-4">
                    @foreach([
                        ['name' => 'Areeba Khan', 'text' => 'Absolutely stunning jewelry! The quality exceeded my expectations. The packaging felt like unwrapping a luxury gift.'],
                        ['name' => 'Sana Malik', 'text' => 'The abaya collection is gorgeous. Perfect fit and beautiful fabric. Every detail speaks premium craftsmanship.'],
                        ['name' => 'Hania Saeed', 'text' => 'Fast delivery and amazing quality. The necklace set looks even better in person. Will order again!'],
                    ] as $testimonial)
                        <div class="glass rounded-2xl p-5">
                            <div class="flex gap-1 mb-3">
                                @for($i = 0; $i < 5; $i++)
                                    <svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                @endfor
                            </div>
                            <p class="text-sm text-cream/70 italic leading-relaxed mb-3">"{{ $testimonial['text'] }}"</p>
                            <p class="text-gold text-xs font-semibold uppercase tracking-[0.14em]">{{ $testimonial['name'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
            {{-- Newsletter --}}
            <div class="flex flex-col justify-center">
                <div class="glass rounded-2xl p-8 md:p-10">
                    <p class="text-[10px] uppercase tracking-[0.38em] text-sand md:text-[11px]">Stay Updated</p>
                    <h2 class="mt-2 text-2xl font-semibold text-cream md:text-3xl">Join The Inner Circle</h2>
                    <p class="mt-4 text-sm text-cream/50 leading-relaxed">Get exclusive access to new arrivals, special offers, and styling tips delivered straight to your inbox.</p>
                    <form class="mt-6 space-y-3" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Subscribed ✓';">
                        <input type="email" placeholder="Your email address" required
                               class="w-full px-4 py-3 rounded-xl bg-ink border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
                        <button type="submit" class="w-full py-3 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-gold-light transition tracking-[0.18em] uppercase">Subscribe</button>
                    </form>
                    <p class="mt-3 text-[10px] text-cream/30 uppercase tracking-[0.14em]">No spam — just curated luxury updates.</p>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection
