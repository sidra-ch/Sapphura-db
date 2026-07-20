@extends('layouts.app')
@section('title', 'Sapphura — Luxury Fashion & Jewelry')

@section('content')

{{-- ============================================================
     ANNOUNCEMENT BAR
============================================================ --}}
<div class="border-b border-gold/[0.1] bg-gold/8 py-3 px-6">
  <div class="section-shell">
    <div class="flex items-center justify-center gap-3 text-center">
      <span class="text-lg">✨</span>
      <p class="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-light">
        Free Delivery on Orders Above PKR 1,500 • Custom Stitching Available
      </p>
      <span class="text-lg">✨</span>
    </div>
  </div>
</div>

{{-- ============================================================
     ELEGANT HERO — Premium Fashion Brand
============================================================ --}}
<section class="relative overflow-hidden py-20 md:py-32 px-6 sm:px-10 md:px-16"
         style="background:linear-gradient(135deg, rgba(10,22,48,0.9) 0%, rgba(19,33,63,0.6) 50%, rgba(10,22,48,0.8) 100%); min-height:600px;">
  
  {{-- Background accent elements --}}
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-24 -right-32 w-96 h-96 rounded-full" 
         style="background:radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);"></div>
    <div class="absolute -bottom-32 -left-24 w-80 h-80 rounded-full" 
         style="background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);"></div>
  </div>

  {{-- Content --}}
  <div class="relative z-10 max-w-4xl mx-auto text-center">
    {{-- Eyebrow --}}
    <div class="inline-flex items-center gap-3 mb-6">
      <span class="h-px w-8 bg-gold/50"></span>
      <span class="text-[9px] uppercase tracking-[0.5em] font-light text-gold/70">Summer Collection 2026</span>
      <span class="h-px w-8 bg-gold/50"></span>
    </div>

    {{-- Headline --}}
    <h1 class="text-5xl sm:text-6xl md:text-7xl font-light leading-tight mb-6 text-cream"
        style="font-family:Georgia,serif; letter-spacing:-0.02em;">
      Timeless <span class="text-gold">Elegance</span>
    </h1>

    {{-- Subheading --}}
    <p class="text-base sm:text-lg text-cream/70 max-w-2xl mx-auto mb-10 leading-relaxed">
      Discover our curated collection of premium women's fashion, jewelry, and accessories crafted with luxury and sophistication in mind.
    </p>

    {{-- CTAs --}}
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/collections" 
         class="inline-flex items-center gap-3 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 rounded-lg"
         style="background:#d4af37; color:#09111f; border:1px solid #d4af37;"
         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 32px rgba(212,175,55,0.3)';"
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
        Shop Collection
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/>
        </svg>
      </a>
      <a href="#new-arrivals" 
         class="inline-flex items-center gap-3 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 rounded-lg"
         style="background:transparent; color:#d4af37; border:1px solid rgba(212,175,55,0.5);"
         onmouseover="this.style.borderColor='rgba(212,175,55,0.9)'; this.style.color='#e8c967';"
         onmouseout="this.style.borderColor='rgba(212,175,55,0.5)'; this.style.color='#d4af37';">
        Explore More
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </a>
    </div>
  </div>

  {{-- Scroll indicator --}}
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 hidden md:flex">
    <span class="text-[8px] uppercase tracking-[0.4em] text-cream/30">Scroll to Explore</span>
    <div class="flex flex-col gap-1">
      <svg class="w-5 h-5 text-cream/30 animate-bounce" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
      </svg>
    </div>
  </div>
</section>

{{-- ============================================================
     TRUST BAR
============================================================ --}}
<section class="border-y border-gold/[0.08] bg-ink/80 py-4">
  <div class="section-shell">
    <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
      <div class="flex items-center gap-2"><span class="text-base">🚚</span><span class="text-[10px] uppercase tracking-[0.22em] text-cream/50">Free Delivery above Rs.1500</span></div>
      <div class="flex items-center gap-2"><span class="text-base">🔄</span><span class="text-[10px] uppercase tracking-[0.22em] text-cream/50">Easy 7-Day Exchange</span></div>
      <div class="flex items-center gap-2"><span class="text-base">🔒</span><span class="text-[10px] uppercase tracking-[0.22em] text-cream/50">Secure Checkout</span></div>
      <div class="flex items-center gap-2"><span class="text-base">📦</span><span class="text-[10px] uppercase tracking-[0.22em] text-cream/50">Premium Packaging</span></div>
      <div class="flex items-center gap-2"><span class="text-base">💬</span><span class="text-[10px] uppercase tracking-[0.22em] text-cream/50">WhatsApp Support</span></div>
    </div>
  </div>
</section>

{{-- ============================================================
     CATEGORY GRID
============================================================ --}}
<section class="py-16 md:py-20">
  <div class="section-shell">
    <div class="mb-10 text-center">
      <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60 md:text-[11px]">Browse Collection</p>
      <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Shop by Category</h2>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <a href="/collections?category=Jewelry" class="luxury-card group relative overflow-hidden rounded-2xl">
        <div class="aspect-[3/4] overflow-hidden">
          <img src="/neckles-3.jpeg" alt="Jewelry" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Rings · Necklaces · Earrings</p>
          <h3 class="mt-1 text-lg font-semibold text-cream group-hover:text-gold transition-colors duration-300">Jewelry</h3>
          <span class="mt-2 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-white/30 group-hover:text-gold/70 transition-colors duration-300">Shop Now <svg class="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </a>
      <a href="/collections?category=Clothing" class="luxury-card group relative overflow-hidden rounded-2xl">
        <div class="aspect-[3/4] overflow-hidden">
          <img src="/summer-1.jpeg" alt="Clothing" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Suits · Formals · Casuals</p>
          <h3 class="mt-1 text-lg font-semibold text-cream group-hover:text-gold transition-colors duration-300">Clothing</h3>
          <span class="mt-2 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-white/30 group-hover:text-gold/70 transition-colors duration-300">Shop Now <svg class="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </a>
      <a href="/collections?category=Stitch+Suits" class="luxury-card group relative overflow-hidden rounded-2xl">
        <div class="aspect-[3/4] overflow-hidden">
          <img src="/stitch%20suit/img-1.jpeg" alt="Stitch Suits" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Stitched · Embroidered · Custom</p>
          <h3 class="mt-1 text-lg font-semibold text-cream group-hover:text-gold transition-colors duration-300">Stitch Suits</h3>
          <span class="mt-2 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-white/30 group-hover:text-gold/70 transition-colors duration-300">Shop Now <svg class="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </a>
      <a href="/collections?category=Makeup" class="luxury-card group relative overflow-hidden rounded-2xl">
        <div class="aspect-[3/4] overflow-hidden">
          <img src="/make-up.jpeg" alt="Makeup" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5">
          <p class="text-[9px] uppercase tracking-[0.3em] text-gold/60">Lipsticks · Perfumes · Skincare</p>
          <h3 class="mt-1 text-lg font-semibold text-cream group-hover:text-gold transition-colors duration-300">Makeup</h3>
          <span class="mt-2 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] text-white/30 group-hover:text-gold/70 transition-colors duration-300">Shop Now <svg class="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </a>
    </div>
  </div>
</section>

{{-- ============================================================
     BEST SELLERS
============================================================ --}}
<section class="border-t border-gold/[0.07] py-16 md:py-20">
  <div class="section-shell">
    <div class="mb-10 flex items-end justify-between gap-4">
      <div>
        <p class="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.45em] text-gold/55">
          <span class="h-px w-5 bg-gold/35 inline-block"></span>Curated Selection
        </p>
        <h2 class="text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Best Sellers</h2>
      </div>
      <a href="/collections" class="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition hover:bg-gold hover:text-ink hover:border-gold">
        View All <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
      </a>
    </div>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5">
      @foreach($featured as $product)
        @include('partials.product-card', ['product' => $product])
      @endforeach
    </div>
    <div class="mt-8 text-center sm:hidden">
      <a href="/collections" class="inline-flex items-center gap-2 rounded-full border border-gold/25 px-6 py-3 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition hover:bg-gold hover:text-ink">View All Products</a>
    </div>
  </div>
</section>

{{-- ============================================================
     MARQUEE STRIP
============================================================ --}}
<div class="border-y border-gold/[0.07] overflow-hidden py-4">
  <div class="animate-marquee flex gap-8 whitespace-nowrap">
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>SAPPHURA</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>PREMIUM QUALITY</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>SIGNATURE EDIT</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>LUXURY JEWELRY</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>CRAFTED WITH CARE</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>NATIONWIDE DELIVERY</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>EASY EXCHANGE</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>SAPPHURA</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>PREMIUM QUALITY</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>SIGNATURE EDIT</span>
    <span class="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-cream/25"><span class="h-1.5 w-1.5 rounded-full bg-gold/40 inline-block flex-shrink-0"></span>LUXURY JEWELRY</span>
  </div>
</div>

{{-- ============================================================
     NEW ARRIVALS
============================================================ --}}
<section class="border-t border-gold/[0.07] py-16 md:py-20">
  <div class="section-shell">
    <div class="mb-10 flex items-end justify-between gap-4">
      <div>
        <p class="mb-1.5 flex items-center gap-2 text-[9px] uppercase tracking-[0.45em] text-gold/55">
          <span class="h-px w-5 bg-gold/35 inline-block"></span>Just Arrived
        </p>
        <h2 class="text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">New Arrivals</h2>
      </div>
      <a href="/collections?sort=newest" class="hidden sm:inline-flex items-center gap-2 rounded-full border border-gold/25 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-gold/70 transition hover:bg-gold hover:text-ink hover:border-gold">
        See All <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4-4 4M3 12h18"/></svg>
      </a>
    </div>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-5">
      @foreach($latest as $product)
        @include('partials.product-card', ['product' => $product])
      @endforeach
    </div>
  </div>
</section>

{{-- ============================================================
     STITCH SUITS — Custom Order / Booking Section
============================================================ --}}
<section id="stitch-order" class="border-t border-gold/[0.07] py-16 md:py-20 bg-[#07090f]">
  <div class="section-shell">
    <div class="mb-10 text-center">
      <p class="mb-2 text-[9px] uppercase tracking-[0.5em] text-gold/55">Custom Stitching Service</p>
      <h2 class="text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">
        Stitch Suit <span style="-webkit-text-stroke:1px rgba(212,175,55,0.55); color:transparent;">Orders</span>
      </h2>
      <p class="mt-3 text-sm text-cream/40 max-w-lg mx-auto">
        Apni pasand ki suit choose kar ke hum se custom stitching order karein. WhatsApp, call ya form ke zariye asaani se booking karein.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2 lg:gap-8">
      {{-- LEFT: Gallery + steps --}}
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="relative overflow-hidden rounded-xl border border-gold/10 group">
            <img src="/stitch%20suit/img-1.jpeg" alt="Stitch Suit 1" class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          </div>
          <div class="relative overflow-hidden rounded-xl border border-gold/10 group">
            <img src="/stitch%20suit/img-2.jpeg" alt="Stitch Suit 2" class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          </div>
          <div class="relative overflow-hidden rounded-xl border border-gold/10 group">
            <img src="/stitch%20suit/img-3.jpeg" alt="Stitch Suit 3" class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          </div>
          <div class="relative overflow-hidden rounded-xl border border-gold/10 group">
            <img src="/stitch%20suit/img-4.jpeg" alt="Stitch Suit 4" class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          </div>
        </div>
        <div class="rounded-2xl border border-gold/10 bg-ink/40 p-5">
          <p class="mb-4 text-[9px] uppercase tracking-[0.4em] text-gold/55">How It Works</p>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full border border-gold/25 bg-gold/[0.06] flex items-center justify-center text-[9px] font-light text-gold/70">01</span>
              <p class="text-xs text-cream/55 leading-relaxed pt-1">Choose a design from our gallery or send your own image</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full border border-gold/25 bg-gold/[0.06] flex items-center justify-center text-[9px] font-light text-gold/70">02</span>
              <p class="text-xs text-cream/55 leading-relaxed pt-1">Send your measurements via WhatsApp or the form below</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full border border-gold/25 bg-gold/[0.06] flex items-center justify-center text-[9px] font-light text-gold/70">03</span>
              <p class="text-xs text-cream/55 leading-relaxed pt-1">We confirm your order and pricing within 24 hours</p>
            </div>
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-7 h-7 rounded-full border border-gold/25 bg-gold/[0.06] flex items-center justify-center text-[9px] font-light text-gold/70">04</span>
              <p class="text-xs text-cream/55 leading-relaxed pt-1">Delivery in 7–10 working days across Pakistan</p>
            </div>
          </div>
        </div>
      </div>

      {{-- RIGHT: Contact + form --}}
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-3">
          <a href="https://wa.me/923320924951?text=Assalam%20o%20Alaikum!%20I%20want%20to%20order%20a%20Stitch%20Suit.%20Please%20help%20me."
             target="_blank"
             class="flex items-center justify-center gap-2.5 rounded-xl py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02]"
             style="background:rgba(37,211,102,0.1); border:1px solid rgba(37,211,102,0.3); color:rgb(37,211,102);"
             onmouseover="this.style.background='rgba(37,211,102,0.18)';"
             onmouseout="this.style.background='rgba(37,211,102,0.1)';">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.472-.752-6.22-2.03l-.434-.326-2.746.72.735-2.686-.357-.567A9.944 9.944 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
            WhatsApp Order
          </a>
          <a href="tel:+923320924951"
             class="flex items-center justify-center gap-2.5 rounded-xl py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02]"
             style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.25); color:rgba(212,175,55,0.85);"
             onmouseover="this.style.background='rgba(212,175,55,0.15)';"
             onmouseout="this.style.background='rgba(212,175,55,0.08)';">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
            Call Us
          </a>
        </div>

        <div class="rounded-2xl border border-gold/10 bg-ink/40 p-5 md:p-6"
             x-data="{ sent: false, sending: false }">
          <p class="mb-5 text-[9px] uppercase tracking-[0.4em] text-gold/55">Send Stitch Order Request</p>

          <form x-show="!sent"
                @submit.prevent="
                  sending = true;
                  setTimeout(() => { sent = true; sending = false; }, 800);
                "
                class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="name" type="text" placeholder="Full Name *" required
                     class="w-full rounded-xl border border-gold/15 bg-navy/60 px-4 py-3 text-sm text-cream placeholder-cream/25 focus:border-gold/50 focus:outline-none transition">
              <input name="phone" type="tel" placeholder="Phone / WhatsApp *" required
                     class="w-full rounded-xl border border-gold/15 bg-navy/60 px-4 py-3 text-sm text-cream placeholder-cream/25 focus:border-gold/50 focus:outline-none transition">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input name="city" type="text" placeholder="City *" required
                     class="w-full rounded-xl border border-gold/15 bg-navy/60 px-4 py-3 text-sm text-cream placeholder-cream/25 focus:border-gold/50 focus:outline-none transition">
              <select name="size" class="w-full rounded-xl border border-gold/15 bg-navy/60 px-4 py-3 text-sm text-cream focus:border-gold/50 focus:outline-none transition appearance-none">
                <option value="" class="bg-navy">Size (Optional)</option>
                <option value="XS" class="bg-navy">XS – Extra Small</option>
                <option value="S" class="bg-navy">S – Small</option>
                <option value="M" class="bg-navy">M – Medium</option>
                <option value="L" class="bg-navy">L – Large</option>
                <option value="XL" class="bg-navy">XL – Extra Large</option>
                <option value="XXL" class="bg-navy">XXL – Plus</option>
                <option value="custom" class="bg-navy">Custom Measurements</option>
              </select>
            </div>
            <textarea name="notes" rows="3" placeholder="Design details, fabric preference, special requests..."
                      class="w-full rounded-xl border border-gold/15 bg-navy/60 px-4 py-3 text-sm text-cream placeholder-cream/25 focus:border-gold/50 focus:outline-none transition resize-none"></textarea>
            <button type="submit" :disabled="sending"
                    class="w-full rounded-xl py-3.5 text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 disabled:opacity-60"
                    style="background:#d4af37; color:#09111f;"
                    onmouseover="this.style.background='#e8c967';"
                    onmouseout="this.style.background='#d4af37';">
              <span x-show="!sending">Send Order Request</span>
              <span x-show="sending">Sending...</span>
            </button>
          </form>

          <div x-show="sent" class="text-center py-6">
            <div class="text-4xl mb-3">&#x2705;</div>
            <p class="text-base font-semibold text-cream">Request Sent!</p>
            <p class="mt-1 text-sm text-cream/50">We will contact you within 24 hours via WhatsApp.</p>
            <a href="https://wa.me/923320924951" target="_blank"
               class="mt-4 inline-block text-[10px] uppercase tracking-[0.28em] text-gold/70 hover:text-gold transition">
              Message us directly on WhatsApp &rarr;
            </a>
          </div>
        </div>

        <div class="rounded-xl border border-gold/10 bg-gold/[0.03] px-4 py-3 flex items-center gap-3">
          <span class="text-xl">&#128207;</span>
          <p class="text-xs text-cream/45 leading-relaxed">
            Measurements guide available on <a href="https://wa.me/923320924951" target="_blank" class="text-gold/60 hover:text-gold underline underline-offset-2 transition">WhatsApp</a>. We will send you a simple measurement form.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

{{-- ============================================================
     PAYMENT METHODS
============================================================ --}}
<section class="border-t border-gold/[0.07] py-12 md:py-16 bg-ink/60">
  <div class="section-shell">
    <div class="mb-8 text-center">
      <p class="text-[9px] uppercase tracking-[0.4em] text-gold/55">Safe &amp; Secure</p>
      <h2 class="mt-2 text-xl font-light text-cream md:text-2xl" style="font-family:Georgia,serif;">We Accept All Major Payment Methods</h2>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-2xl border border-[#1ba462]/25 bg-[#1ba462]/8 p-5 text-center hover:border-[#1ba462]/50 transition-all duration-300 group">
        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1ba462]/15 group-hover:bg-[#1ba462]/25 transition-all duration-300">
          <svg class="w-7 h-7" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#1ba462"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="10" font-weight="bold">EP</text></svg>
        </div>
        <p class="text-sm font-semibold" style="color:#4ade80;">EasyPaisa</p>
        <p class="mt-1 text-[9px] text-cream/40 uppercase tracking-[0.15em]">Mobile Wallet</p>
        <p class="mt-1.5 text-[8px] text-cream/25">Fastest PKR transfer</p>
      </div>
      <div class="rounded-2xl border border-[#e31837]/25 bg-[#e31837]/8 p-5 text-center hover:border-[#e31837]/50 transition-all duration-300 group">
        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e31837]/15 group-hover:bg-[#e31837]/25 transition-all duration-300">
          <svg class="w-7 h-7" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#e31837"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="9" font-weight="bold">JC</text></svg>
        </div>
        <p class="text-sm font-semibold" style="color:#f87171;">JazzCash</p>
        <p class="mt-1 text-[9px] text-cream/40 uppercase tracking-[0.15em]">Mobile Wallet</p>
        <p class="mt-1.5 text-[8px] text-cream/25">Instant payment</p>
      </div>
      <div class="rounded-2xl border border-gold/20 bg-gold/[0.06] p-5 text-center hover:border-gold/40 transition-all duration-300 group">
        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 group-hover:bg-gold/20 transition-all duration-300 text-2xl">
          &#x1F4B5;
        </div>
        <p class="text-sm font-semibold text-gold">Cash on Delivery</p>
        <p class="mt-1 text-[9px] text-cream/40 uppercase tracking-[0.15em]">Pay on Receipt</p>
        <p class="mt-1.5 text-[8px] text-cream/25">Nationwide COD</p>
      </div>
      <div class="rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-5 text-center hover:border-blue-500/40 transition-all duration-300 group">
        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300 text-2xl">
          &#x1F4B3;
        </div>
        <p class="text-sm font-semibold text-blue-300">Debit / Credit</p>
        <p class="mt-1 text-[9px] text-cream/40 uppercase tracking-[0.15em]">Visa &middot; Mastercard</p>
        <p class="mt-1.5 text-[8px] text-cream/25">SSL encrypted</p>
      </div>
    </div>
    <p class="mt-6 text-center text-[10px] text-cream/25 uppercase tracking-[0.22em]">
      100% Secure &middot; SSL Encrypted &middot; Your data is always safe
    </p>
  </div>
</section>

{{-- ============================================================
     BRAND STORY
============================================================ --}}
<section class="border-t border-gold/[0.07] py-16 md:py-20">
  <div class="section-shell">
    <div class="grid items-center gap-10 lg:grid-cols-2">
      <div class="group relative overflow-hidden rounded-3xl border border-gold/10">
        <img src="/summer-2.jpeg" alt="Sapphura Story"
             class="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent"></div>
      </div>
      <div>
        <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60">Our Story</p>
        <h2 class="mt-3 text-2xl font-light leading-tight text-cream md:text-3xl lg:text-4xl" style="font-family:Georgia,serif;">
          Crafting Elegance<br>Since Day One
        </h2>
        <p class="mt-5 text-sm leading-7 text-cream/55">
          At Sapphura, every piece is crafted with passion — blending traditional artistry with modern design. From signature jewelry to premium stitch suits, we create pieces that tell your unique story.
        </p>
        <div class="mt-6 flex flex-wrap gap-2">
          <span class="rounded-full border border-gold/20 bg-gold/[0.07] px-4 py-1.5 text-[9px] uppercase tracking-[0.22em] text-gold/80">Luxury First</span>
          <span class="rounded-full border border-gold/20 bg-gold/[0.07] px-4 py-1.5 text-[9px] uppercase tracking-[0.22em] text-gold/80">Premium Quality</span>
          <span class="rounded-full border border-gold/20 bg-gold/[0.07] px-4 py-1.5 text-[9px] uppercase tracking-[0.22em] text-gold/80">Trusted Brand</span>
        </div>
        <div class="mt-8 grid grid-cols-3 gap-6">
          <div><p class="text-2xl font-bold text-gold">10K+</p><p class="mt-1 text-[9px] uppercase tracking-[0.16em] text-cream/40">Happy Customers</p></div>
          <div><p class="text-2xl font-bold text-gold">500+</p><p class="mt-1 text-[9px] uppercase tracking-[0.16em] text-cream/40">Products</p></div>
          <div><p class="text-2xl font-bold text-gold">50+</p><p class="mt-1 text-[9px] uppercase tracking-[0.16em] text-cream/40">Collections</p></div>
        </div>
        <a href="/about" class="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-light">
          Read Our Story
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

{{-- ============================================================
     TESTIMONIALS + NEWSLETTER
============================================================ --}}
<section class="border-t border-gold/[0.07] py-16 md:py-20">
  <div class="section-shell">
    <div class="grid gap-10 lg:grid-cols-2">
      <div>
        <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60">Customer Reviews</p>
        <h2 class="mt-2 mb-7 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">What They Say</h2>
        <div class="space-y-4">
          <div class="glass rounded-2xl p-5">
            <div class="flex gap-1 mb-3"><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>
            <p class="text-sm text-cream/65 italic leading-relaxed mb-3">"Absolutely stunning jewelry! Quality exceeded my expectations. The packaging felt like unwrapping a luxury gift."</p>
            <p class="text-gold text-xs font-semibold uppercase tracking-[0.14em]">Areeba Khan</p>
          </div>
          <div class="glass rounded-2xl p-5">
            <div class="flex gap-1 mb-3"><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>
            <p class="text-sm text-cream/65 italic leading-relaxed mb-3">"The stitch suit collection is gorgeous. Perfect fit and beautiful fabric — every detail speaks premium craftsmanship."</p>
            <p class="text-gold text-xs font-semibold uppercase tracking-[0.14em]">Sana Malik</p>
          </div>
          <div class="glass rounded-2xl p-5">
            <div class="flex gap-1 mb-3"><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></div>
            <p class="text-sm text-cream/65 italic leading-relaxed mb-3">"Fast delivery and amazing quality. The necklace set looks even better in person. Will definitely order again!"</p>
            <p class="text-gold text-xs font-semibold uppercase tracking-[0.14em]">Hania Saeed</p>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-center">
        <div class="glass rounded-2xl p-7 md:p-9">
          <p class="text-[10px] uppercase tracking-[0.4em] text-gold/60">Stay Updated</p>
          <h2 class="mt-2 text-2xl font-light text-cream md:text-3xl" style="font-family:Georgia,serif;">Join The Inner Circle</h2>
          <p class="mt-4 text-sm text-cream/45 leading-relaxed">Get exclusive access to new arrivals, special offers and styling tips — straight to your inbox.</p>
          <form class="mt-6 space-y-3" onsubmit="event.preventDefault(); this.querySelector('button').textContent='Subscribed! ✓'; this.querySelector('input').disabled=true; this.querySelector('button').disabled=true;">
            <input type="email" placeholder="Your email address" required
                   class="w-full px-4 py-3 rounded-xl bg-ink border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm transition">
            <button type="submit" class="w-full py-3 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-gold-light transition tracking-[0.18em] uppercase">Subscribe</button>
          </form>
          <p class="mt-3 text-[10px] text-cream/25 uppercase tracking-[0.14em]">No spam. Only curated luxury updates.</p>
          <div class="mt-6 flex items-center gap-4 pt-5 border-t border-gold/10">
            <span class="text-[9px] uppercase tracking-[0.3em] text-cream/30">Reach us:</span>
            <a href="https://wa.me/923320924951" target="_blank" class="flex items-center gap-1.5 text-[10px] text-green-400/70 hover:text-green-400 transition uppercase tracking-[0.18em]">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.634-1.215A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.326 0-4.472-.752-6.22-2.03l-.434-.326-2.746.72.735-2.686-.357-.567A9.944 9.944 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
              WhatsApp
            </a>
            <a href="/contact" class="flex items-center gap-1.5 text-[10px] text-cream/35 hover:text-gold/70 transition uppercase tracking-[0.18em]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

@endsection
