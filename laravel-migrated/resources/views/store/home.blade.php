@extends('layouts.app')
@section('title', 'Sapphura — Luxury Fashion & Jewelry')
@section('description', 'Shop luxury jewelry, ready-to-wear fashion, unstitched collections, and custom stitching at Sapphura. Premium quality, nationwide delivery.')

@push('styles')
<style>
    #sapphura-hero {
        overflow-x: clip;
        background:
            radial-gradient(circle at 15% 20%, rgba(212, 175, 55, 0.14), transparent 44%),
            linear-gradient(138deg, #060f22 0%, #0a1b36 48%, #060f22 100%);
    }

    #sapphura-hero .hero-carousel {
        position: relative;
        overflow: hidden;
        width: 100%;
        max-width: 100vw;
        border-top: 1px solid rgba(212, 175, 55, 0.26);
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        min-height: clamp(430px, 46vw, 620px);
    }

    #sapphura-hero .hero-track {
        position: relative;
        width: 100%;
        overflow: hidden;
        min-height: inherit;
    }

    #sapphura-hero .hero-slide {
        position: absolute;
        inset: 0;
        display: block;
        overflow: hidden;
        opacity: 0;
        transform: scale(1.008);
        pointer-events: none;
        transition: opacity 0.85s ease, transform 1s ease;
    }

    #sapphura-hero .hero-slide.is-active {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
    }

    #sapphura-hero .hero-slide::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 2;
        background:
            linear-gradient(90deg, rgba(6, 15, 34, 0.9) 0%, rgba(6, 15, 34, 0.72) 34%, rgba(6, 15, 34, 0.42) 56%, rgba(6, 15, 34, 0.14) 74%, rgba(6, 15, 34, 0.36) 100%),
            linear-gradient(180deg, rgba(6, 15, 34, 0.12) 0%, rgba(6, 15, 34, 0.34) 100%);
    }

    #sapphura-hero .hero-copy {
        position: relative;
        z-index: 3;
        min-height: inherit;
        display: flex;
        align-items: center;
        padding: clamp(1.15rem, 2.4vw, 2rem) 0;
    }

    #sapphura-hero .hero-copy-inner {
        width: 100%;
        max-width: min(560px, 100%);
    }

    #sapphura-hero .hero-kicker {
        font-family: "Manrope", sans-serif;
        color: rgba(248, 246, 241, 0.82);
        letter-spacing: 0.3em;
        font-weight: 600;
    }

    #sapphura-hero .hero-title {
        margin-top: 0.5rem;
        color: #f8f6f1;
        font-family: "Cormorant Garamond", Georgia, serif;
        font-size: clamp(2.3rem, 4.9vw, 5rem);
        line-height: 0.92;
        font-weight: 600;
        letter-spacing: 0.008em;
        max-width: 10ch;
    }

    #sapphura-hero .hero-title em {
        color: #d4af37;
        font-style: normal;
        font-weight: 500;
    }

    #sapphura-hero .hero-description {
        margin-top: 1rem;
        color: rgba(248, 246, 241, 0.88);
        max-width: 42ch;
        line-height: 1.78;
        font-family: "Manrope", sans-serif;
        font-size: clamp(0.94rem, 1.1vw, 1.06rem);
    }

    #sapphura-hero .hero-actions {
        margin-top: 1.55rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
    }

    #sapphura-hero .hero-btn-primary,
    #sapphura-hero .hero-btn-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;
        position: relative;
        overflow: hidden;
        border-radius: 0.62rem;
        padding: 0.88rem 1.65rem;
        min-height: 3rem;
        font-size: 0.67rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.19em;
        font-family: "Manrope", sans-serif;
        transition: transform 0.34s ease, box-shadow 0.34s ease, border-color 0.34s ease, color 0.34s ease, background 0.34s ease;
    }

    #sapphura-hero .hero-btn-primary::before,
    #sapphura-hero .hero-btn-secondary::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(118deg, rgba(248, 246, 241, 0.2) 0%, rgba(248, 246, 241, 0) 38%);
        opacity: 0;
        transition: opacity 0.34s ease;
        pointer-events: none;
    }

    #sapphura-hero .hero-btn-primary {
        border: 1px solid rgba(212, 175, 55, 0.92);
        background: linear-gradient(138deg, #e1be48 0%, #c79f2f 45%, #b98f23 100%);
        color: #0a1630;
        box-shadow: 0 14px 30px rgba(4, 10, 24, 0.38), inset 0 0 0 1px rgba(248, 246, 241, 0.24);
    }

    #sapphura-hero .hero-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 34px rgba(4, 10, 24, 0.44), 0 0 22px rgba(212, 175, 55, 0.34);
    }

    #sapphura-hero .hero-btn-primary:hover::before {
        opacity: 1;
    }

    #sapphura-hero .hero-btn-secondary {
        border: 1px solid rgba(212, 175, 55, 0.46);
        background: linear-gradient(160deg, rgba(14, 28, 54, 0.78) 0%, rgba(9, 20, 40, 0.58) 100%);
        backdrop-filter: blur(6px);
        color: #f8f6f1;
        box-shadow: inset 0 0 0 1px rgba(248, 246, 241, 0.1), 0 10px 24px rgba(6, 12, 28, 0.34);
    }

    #sapphura-hero .hero-btn-secondary:hover {
        transform: translateY(-2px);
        border-color: rgba(212, 175, 55, 0.8);
        color: #f8f6f1;
        box-shadow: inset 0 0 0 1px rgba(212, 175, 55, 0.36), 0 16px 30px rgba(8, 16, 35, 0.34);
    }

    #sapphura-hero .hero-btn-secondary:hover::before {
        opacity: 1;
    }

    #sapphura-hero .hero-media {
        position: relative;
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: #081327;
    }

    #sapphura-hero .hero-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: var(--hero-focus, 76% 34%);
        opacity: 0.95;
        filter: saturate(1) contrast(1.03) brightness(0.93);
        transform: scale(1.04);
        transition: transform 6.8s ease;
    }

    #sapphura-hero .hero-slide.is-active .hero-media img {
        transform: scale(1.01);
    }

    #sapphura-hero .hero-media video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: var(--hero-focus, 76% 34%);
        opacity: 0.95;
        filter: saturate(1.02) contrast(1.02) brightness(0.92);
        transform: scale(1.03);
        transition: transform 6.8s ease;
    }

    #sapphura-hero .hero-slide.is-active .hero-media video {
        transform: scale(1.01);
    }

    #sapphura-hero .hero-controls {
        position: absolute;
        left: 50%;
        width: min(1240px, calc(100% - 1.5rem));
        transform: translateX(-50%);
        bottom: 0.85rem;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #sapphura-hero .hero-dots {
        display: flex;
        gap: 0.42rem;
    }

    #sapphura-hero .hero-dot {
        position: relative;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        background: transparent;
        border: 0;
        opacity: 0.9;
        transition: transform 0.35s ease;
    }

    #sapphura-hero .hero-dot::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0.7rem;
        height: 0.7rem;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        border: 1px solid rgba(212, 175, 55, 0.72);
        background: transparent;
        transition: background-color 0.35s ease, transform 0.35s ease;
    }

    #sapphura-hero .hero-dot.is-active {
        transform: scale(1.04);
        opacity: 1;
    }

    #sapphura-hero .hero-dot.is-active::before {
        background: #d4af37;
        transform: translate(-50%, -50%) scale(1.06);
    }

    #sapphura-hero .hero-nav {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
    }

    #sapphura-hero .hero-nav-btn {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        border: 1px solid rgba(212, 175, 55, 0.62);
        background: rgba(6, 15, 34, 0.58);
        color: #f8f6f1;
        transition: background-color 0.35s ease, border-color 0.35s ease;
    }

    #sapphura-hero .hero-nav-btn:hover {
        border-color: rgba(212, 175, 55, 0.85);
        background: rgba(6, 15, 34, 0.86);
    }

    @media (max-width: 1023px) {
        #sapphura-hero .hero-copy {
            align-items: flex-start;
            padding: 1.6rem 0.9rem 1.4rem;
        }

        #sapphura-hero .hero-media img {
            object-fit: cover;
            object-position: var(--hero-focus-mobile, 68% 28%);
            transform: scale(1.02);
        }

        #sapphura-hero .hero-media video {
            object-fit: cover;
            object-position: var(--hero-focus-mobile, 68% 28%);
            transform: scale(1.02);
        }

        #sapphura-hero .hero-title {
            font-size: clamp(2.2rem, 9.2vw, 3.6rem);
            line-height: 0.9;
            max-width: 12ch;
        }

        #sapphura-hero .hero-description {
            margin-top: 0.95rem;
            font-size: 0.98rem;
            line-height: 1.68;
        }
    }

    @media (max-width: 640px) {
        #sapphura-hero .hero-track {
            min-height: 540px;
        }

        #sapphura-hero .hero-slide::before {
            background:
                linear-gradient(92deg, rgba(5, 12, 27, 0.94) 0%, rgba(5, 12, 27, 0.78) 40%, rgba(5, 12, 27, 0.52) 66%, rgba(5, 12, 27, 0.28) 100%),
                linear-gradient(180deg, rgba(5, 12, 27, 0.2) 0%, rgba(5, 12, 27, 0.58) 100%);
        }

        #sapphura-hero .hero-copy {
            align-items: center;
            padding: 2.2rem 1rem 1.9rem;
        }

        #sapphura-hero .hero-copy-inner {
            max-width: min(332px, 100%);
            border: 0;
            border-radius: 0;
            background: transparent;
            backdrop-filter: none;
            padding: 0;
            box-shadow: none;
            text-align: center;
        }

        #sapphura-hero .hero-kicker {
            margin-bottom: 0.42rem;
        }

        #sapphura-hero .hero-title {
            font-size: clamp(2.05rem, 8.6vw, 3.05rem);
            line-height: 1.01;
            letter-spacing: 0.01em;
        }

        #sapphura-hero .hero-title span {
            display: block;
        }

        #sapphura-hero .hero-title span + span {
            margin-top: 0.18rem;
        }

        #sapphura-hero .hero-description {
            margin-top: 0.72rem;
            font-size: 0.88rem;
            line-height: 1.5;
            max-width: 31ch;
            color: rgba(248, 246, 241, 0.84);
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-shadow: 0 1px 8px rgba(5, 12, 27, 0.45);
            margin-left: auto;
            margin-right: auto;
        }

        #sapphura-hero .hero-btn-primary,
        #sapphura-hero .hero-btn-secondary {
            width: auto;
            max-width: none;
            min-height: 44px;
            border-radius: 0.6rem;
            letter-spacing: 0.15em;
        }

        #sapphura-hero .hero-actions {
            margin-top: 1.08rem;
            gap: 0.8rem;
            align-items: center;
            justify-content: center;
            transform: translateY(10px);
        }

        #sapphura-hero .hero-btn-primary {
            padding: 0.76rem 1.2rem;
            font-size: 0.62rem;
        }

        #sapphura-hero .hero-btn-secondary {
            min-height: auto;
            border: 0;
            padding: 0;
            border-radius: 0;
            font-size: 0.65rem;
            letter-spacing: 0.17em;
            background: transparent;
            color: rgba(248, 246, 241, 0.88);
            text-transform: uppercase;
            text-decoration: underline;
            text-underline-offset: 0.3rem;
            text-decoration-color: rgba(212, 175, 55, 0.55);
            box-shadow: none;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
        }

        #sapphura-hero .hero-btn-secondary::before,
        #sapphura-hero .hero-btn-primary::before {
            display: none;
        }

        #sapphura-hero .hero-btn-secondary:hover {
            color: #d4af37;
            border: 0;
            box-shadow: none;
        }

        #sapphura-hero .hero-btn-secondary svg {
            width: 0.78rem;
            height: 0.78rem;
        }

        #sapphura-hero .hero-controls {
            width: calc(100% - 1rem);
            bottom: 0.75rem;
        }

        #sapphura-hero .hero-kicker {
            letter-spacing: 0.26em;
        }
    }
</style>
@endpush

@section('content')

<section id="sapphura-hero" class="relative isolate overflow-hidden border-b border-gold/10">
    @php
        $heroSlides = [
            [
                'kicker' => 'Sapphura Motion Edit',
                'title1' => 'Luxury in Motion,',
                'title2a' => 'Crafted to',
                'title2b' => 'Captivate',
                'description' => 'Experience Sapphura through a premium visual story featuring signature styling, detail, and modern elegance.',
                'mobile_description' => 'Signature luxury, now in motion.',
                'video' => '/sapphura%20video_1.mp4',
                'alt' => 'Sapphura premium fashion video showcase',
                'focus' => '66% 36%',
                'focus_mobile' => '60% 34%',
                'primary_cta_label' => 'Watch Collection Edit',
                'primary_cta_mobile_label' => 'Watch Edit',
                'primary_cta_href' => '/collections',
                'secondary_cta_label' => 'Shop Signature Styles',
                'secondary_cta_mobile_label' => 'Shop Styles',
                'secondary_cta_href' => '/collections?search=luxury',
            ],
            [
                'kicker' => 'Summer Sale',
                'title1' => 'Up to 30% OFF',
                'title2a' => 'On Curated',
                'title2b' => 'Items',
                'description' => 'Exclusive seasonal savings on signature jewelry and statement pieces designed for graceful celebrations.',
                'mobile_description' => 'Curated luxury, now on sale.',
                'image' => '/bracelet-1.jpeg',
                'alt' => 'Purple gemstone bracelet in luxury style',
                'focus' => '72% 44%',
                'focus_mobile' => '64% 42%',
                'primary_cta_label' => 'Shop The Sale',
                'primary_cta_mobile_label' => 'Shop Sale',
                'primary_cta_href' => '/collections?on_sale=1',
                'secondary_cta_label' => 'Explore New Arrivals',
                'secondary_cta_mobile_label' => 'New Arrivals',
                'secondary_cta_href' => '/collections?sort=newest',
            ],
            [
                'kicker' => 'Luxury Pret',
                'title1' => 'Refined Edit,',
                'title2a' => 'Designed to',
                'title2b' => 'Enchant',
                'description' => 'Modern cuts with couture-inspired finesse for women who choose confident elegance over fleeting trends.',
                'mobile_description' => 'Modern pret with couture polish.',
                'image' => '/bangals-4.jpeg',
                'alt' => 'Luxury bangles styled in an editorial product shot',
                'focus' => '68% 48%',
                'focus_mobile' => '62% 44%',
            ],
            [
                'kicker' => 'Makeup Edit',
                'title1' => 'Radiant Beauty,',
                'title2a' => 'Curated for',
                'title2b' => 'Lustre',
                'description' => 'Velvet textures, timeless shades, and elegant finishing touches crafted for a luminous luxury look.',
                'mobile_description' => 'Timeless beauty with a luxe finish.',
                'image' => '/make-up.jpeg',
                'alt' => 'Luxury makeup collection for elegant women',
                'focus' => '72% 34%',
                'focus_mobile' => '66% 34%',
                'primary_cta_label' => 'Shop Makeup Edit',
                'primary_cta_mobile_label' => 'Shop Makeup',
                'primary_cta_href' => '/collections?category=Makeup',
                'secondary_cta_label' => 'Explore Beauty Picks',
                'secondary_cta_mobile_label' => 'Beauty Picks',
                'secondary_cta_href' => '/collections?search=makeup',
            ],
        ];
    @endphp

    <div class="hero-carousel" data-hero-carousel>
            <div class="hero-track">
                @foreach($heroSlides as $slide)
                    <article class="hero-slide {{ $loop->first ? 'is-active' : '' }}" data-hero-slide>
                        <div class="hero-media">
                            @if(!empty($slide['video']))
                                <video autoplay muted loop playsinline preload="metadata" style="--hero-focus: {{ $slide['focus'] ?? '74% 22%' }}; --hero-focus-mobile: {{ $slide['focus_mobile'] ?? '66% 20%' }};" aria-label="{{ $slide['alt'] }}">
                                    <source src="{{ $slide['video'] }}" type="video/mp4">
                                </video>
                            @else
                                <img src="{{ $slide['image'] }}" alt="{{ $slide['alt'] }}" loading="lazy" style="--hero-focus: {{ $slide['focus'] ?? '74% 22%' }}; --hero-focus-mobile: {{ $slide['focus_mobile'] ?? '66% 20%' }};">
                            @endif
                        </div>
                        <div class="hero-copy">
                            <div class="section-shell w-full">
                                <div class="hero-copy-inner">
                                    <p class="hero-kicker text-[10px] uppercase">{{ $slide['kicker'] }}</p>
                                    <h1 class="hero-title">
                                        <span>{{ $slide['title1'] }}</span>
                                        <span>{{ $slide['title2a'] }} <em>{{ $slide['title2b'] }}</em></span>
                                    </h1>
                                    <p class="hero-description text-[15px] sm:text-base">
                                        <span class="sm:hidden">{{ $slide['mobile_description'] ?? $slide['description'] }}</span>
                                        <span class="hidden sm:inline">{{ $slide['description'] }}</span>
                                    </p>
                                    <div class="hero-actions">
                                        <a href="{{ $slide['primary_cta_href'] ?? '/collections?search=Luxury' }}" class="hero-btn-primary sm:whitespace-nowrap">
                                            <span class="sm:hidden">{{ $slide['primary_cta_mobile_label'] ?? $slide['primary_cta_label'] ?? 'Explore' }}</span>
                                            <span class="hidden sm:inline">{{ $slide['primary_cta_label'] ?? 'Explore Collection' }}</span>
                                        </a>
                                        <a href="{{ $slide['secondary_cta_href'] ?? '/stitching' }}" class="hero-btn-secondary sm:whitespace-nowrap">
                                            <span class="sm:hidden">{{ $slide['secondary_cta_mobile_label'] ?? $slide['secondary_cta_label'] ?? 'Stitching' }}</span>
                                            <span class="hidden sm:inline">{{ $slide['secondary_cta_label'] ?? 'Book Stitching' }}</span>
                                            <svg class="sm:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-5-5 5 5-5 5"/></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                @endforeach
            </div>

            <div class="hero-controls">
                <div class="hero-dots" role="tablist" aria-label="Hero slides">
                    @foreach($heroSlides as $slide)
                        <button type="button" class="hero-dot {{ $loop->first ? 'is-active' : '' }}" data-hero-dot="{{ $loop->index }}" aria-label="Go to slide {{ $loop->iteration }}"></button>
                    @endforeach
                </div>
                <div class="hero-nav">
                    <button type="button" class="hero-nav-btn" data-hero-prev aria-label="Previous slide">&#10094;</button>
                    <button type="button" class="hero-nav-btn" data-hero-next aria-label="Next slide">&#10095;</button>
                </div>
            </div>
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
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Necklaces · Earrings · Bracelets</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Jewellery</h3>
                </div>
            </a>
            <a href="/collections?category=Clothing" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/clothes-collection.jpeg" alt="Ready To Wear" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Suits · Dresses · Sets</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Ready To Wear</h3>
                </div>
            </a>
            <a href="/collections?category=Unstitched" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/summer-2.jpeg" alt="Unstitched" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Lawn · Silk · Chiffon</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Unstitched</h3>
                </div>
            </a>
            <a href="/collections?category=Makeup" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/make-up.jpeg" alt="Makeup" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Beauty · Lipsticks · Fragrance</p>
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
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Everyday Luxe</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Ready To Wear</h3>
                </div>
            </a>
            <a href="/collections?search=Luxury" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/newcollection-2.jpeg" alt="Luxury Collection" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Premium Craft</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Luxury Collection</h3>
                </div>
            </a>
            <a href="/collections?category=Jewelry" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/bangals-4.jpeg" alt="Jewellery" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Statement Pieces</p>
                    <h3 class="mt-3 text-xl font-semibold text-cream group-hover:text-gold transition-colors duration-300">Jewellery</h3>
                </div>
            </a>
            <a href="/collections?category=Makeup" class="luxury-card group relative overflow-hidden rounded-3xl">
                <div class="aspect-[4/5] overflow-hidden">
                    <img src="/make-up.jpeg" alt="Makeup" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <p class="hidden text-[9px] uppercase tracking-[0.3em] text-gold/60 sm:block">Beauty Essentials</p>
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

@push('scripts')
<script>
    (function () {
        const root = document.querySelector('[data-hero-carousel]');
        if (!root) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
        const prevBtn = root.querySelector('[data-hero-prev]');
        const nextBtn = root.querySelector('[data-hero-next]');
        let index = 0;
        let timerId = null;

        const activate = (nextIndex) => {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        };

        const start = () => {
            if (prefersReducedMotion) return;
            stop();
            timerId = window.setInterval(() => activate(index + 1), 6400);
        };

        const stop = () => {
            if (timerId) {
                window.clearInterval(timerId);
                timerId = null;
            }
        };

        prevBtn?.addEventListener('click', () => {
            activate(index - 1);
            start();
        });

        nextBtn?.addEventListener('click', () => {
            activate(index + 1);
            start();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                activate(i);
                start();
            });
        });

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);

        activate(0);
        start();
    })();
</script>
@endpush
