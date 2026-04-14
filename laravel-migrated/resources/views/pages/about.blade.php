@extends('layouts.app')
@section('title', 'About Us – Sapphura')

@section('content')
{{-- Hero --}}
<div class="relative py-24 text-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent"></div>
    <div class="absolute top-10 left-1/4 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-0 right-1/3 w-56 h-56 bg-gold/3 rounded-full blur-2xl animate-pulse" style="animation-delay:2s"></div>
    <div class="relative max-w-3xl mx-auto px-4">
        <p class="text-gold/60 uppercase tracking-[0.3em] text-xs mb-4">Discover Sapphura</p>
        <h1 class="text-4xl md:text-6xl font-bold mb-4" style="font-family:Georgia,serif">Our Story</h1>
        <p class="text-cream/60 text-lg">Crafting timeless elegance since day one</p>
    </div>
</div>

<div class="max-w-6xl mx-auto px-4 sm:px-6 pb-20 space-y-20">

    {{-- Brand Story Section --}}
    <section class="grid md:grid-cols-2 gap-12 items-center">
        <div>
            <p class="text-gold/60 uppercase tracking-[0.2em] text-xs mb-3">Est. 2025</p>
            <h2 class="text-3xl md:text-4xl font-bold text-gold mb-6" style="font-family:Georgia,serif">Since 2025</h2>
            <p class="text-cream/70 text-lg leading-relaxed mb-6">
                Sapphura is a premier luxury fashion brand dedicated to bringing you the finest in jewelry,
                clothing, and accessories. Founded with a vision to blend timeless elegance with contemporary
                design, we curate pieces that make a statement.
            </p>
            <p class="text-cream/70 text-lg leading-relaxed mb-8">
                Our collection features exquisite jewelry, stunning abayas, designer dresses, and premium
                makeup products. Each piece is carefully selected to ensure the highest quality and
                craftsmanship that defines true luxury.
            </p>
            {{-- Stats Row --}}
            <div class="flex gap-8">
                <div class="text-center">
                    <p class="text-4xl font-bold text-gold" style="font-family:Georgia,serif">10K+</p>
                    <p class="text-cream/50 text-sm mt-1">Happy Customers</p>
                </div>
                <div class="text-center">
                    <p class="text-4xl font-bold text-gold" style="font-family:Georgia,serif">500+</p>
                    <p class="text-cream/50 text-sm mt-1">Products</p>
                </div>
                <div class="text-center">
                    <p class="text-4xl font-bold text-gold" style="font-family:Georgia,serif">50+</p>
                    <p class="text-cream/50 text-sm mt-1">Collections</p>
                </div>
            </div>
        </div>
        <div class="relative">
            <div class="aspect-square rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/10">
                <img src="/logo-1.png" alt="Sapphura Luxury" class="w-full h-full object-contain bg-[#0B1C3F] p-8">
            </div>
            <div class="absolute -bottom-6 -left-6 bg-gradient-to-br from-gold to-gold-light text-ink p-6 rounded-xl shadow-lg">
                <div class="text-3xl font-bold" style="font-family:Georgia,serif">Since 2025</div>
                <div class="font-semibold text-sm">Excellence in Luxury</div>
            </div>
            {{-- Decorative corner --}}
            <div class="absolute -top-3 -right-3 w-20 h-20 border-t-2 border-r-2 border-gold/30 rounded-tr-2xl"></div>
        </div>
    </section>

    {{-- Mission --}}
    <section class="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-3xl"></div>
        <div class="relative">
            <p class="text-gold/60 uppercase tracking-[0.2em] text-xs mb-3">Our Purpose</p>
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gold" style="font-family:Georgia,serif">Our Mission</h2>
            <p class="text-cream/70 leading-relaxed text-lg max-w-3xl">
                At Sapphura, we believe that luxury should be accessible. Our mission is to bring
                world-class fashion, jewelry, and beauty products to Pakistan at honest prices —
                without compromising on quality or authenticity. Every product in our collection is
                carefully curated to ensure it meets the highest standards of excellence.
            </p>
        </div>
    </section>

    {{-- Values --}}
    <section>
        <div class="text-center mb-10">
            <p class="text-gold/60 uppercase tracking-[0.2em] text-xs mb-3">What Drives Us</p>
            <h2 class="text-3xl md:text-4xl font-bold text-gold" style="font-family:Georgia,serif">Our Values</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="glass rounded-2xl p-8 text-center relative overflow-hidden group hover:border-gold/40 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative">
                    <div class="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/25 transition-all duration-300 group-hover:scale-110">
                        <span class="text-3xl">💎</span>
                    </div>
                    <h3 class="text-xl font-bold text-gold mb-3" style="font-family:Georgia,serif">Quality First</h3>
                    <p class="text-cream/60 leading-relaxed">We source only the finest materials and work with skilled artisans to create pieces that last a lifetime.</p>
                </div>
            </div>
            <div class="glass rounded-2xl p-8 text-center relative overflow-hidden group hover:border-gold/40 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative">
                    <div class="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/25 transition-all duration-300 group-hover:scale-110">
                        <span class="text-3xl">✨</span>
                    </div>
                    <h3 class="text-xl font-bold text-gold mb-3" style="font-family:Georgia,serif">Timeless Design</h3>
                    <p class="text-cream/60 leading-relaxed">Our designs transcend trends, offering you pieces that remain elegant season after season.</p>
                </div>
            </div>
            <div class="glass rounded-2xl p-8 text-center relative overflow-hidden group hover:border-gold/40 transition-all duration-500">
                <div class="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative">
                    <div class="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-gold/25 transition-all duration-300 group-hover:scale-110">
                        <span class="text-3xl">❤️</span>
                    </div>
                    <h3 class="text-xl font-bold text-gold mb-3" style="font-family:Georgia,serif">Customer Delight</h3>
                    <p class="text-cream/60 leading-relaxed">Your satisfaction is our priority. We strive to provide an exceptional shopping experience.</p>
                </div>
            </div>
        </div>
    </section>

    {{-- Why Choose Us --}}
    <section class="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div class="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full blur-3xl"></div>
        <div class="relative">
            <div class="text-center mb-10">
                <p class="text-gold/60 uppercase tracking-[0.2em] text-xs mb-3">The Sapphura Difference</p>
                <h2 class="text-3xl md:text-4xl font-bold text-gold" style="font-family:Georgia,serif">Why Choose Sapphura</h2>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                @foreach([
                    ['icon' => '🛡️', 'title' => '100% Authentic', 'desc' => 'Every product is sourced from authorized distributors — no compromises.'],
                    ['icon' => '🚚', 'title' => 'Nationwide Delivery', 'desc' => 'We deliver across Pakistan with careful packaging and tracking.'],
                    ['icon' => '💰', 'title' => 'Fair Pricing', 'desc' => 'Premium luxury products at prices that make sense for everyone.'],
                    ['icon' => '🔄', 'title' => 'Easy Returns', 'desc' => 'Hassle-free exchange and return policy for your peace of mind.'],
                ] as $item)
                <div class="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                    <div class="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                        <span class="text-xl">{{ $item['icon'] }}</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-gold mb-1">{{ $item['title'] }}</h3>
                        <p class="text-cream/60 text-sm leading-relaxed">{{ $item['desc'] }}</p>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    {{-- Final CTA --}}
    <section class="text-center py-8">
        <p class="text-cream/50 text-lg mb-6">Ready to experience luxury?</p>
        <div class="flex flex-wrap justify-center gap-4">
            <a href="/collections" class="px-8 py-3.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-full tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                Shop Now
            </a>
            <a href="/contact" class="px-8 py-3.5 border border-gold/40 text-gold font-bold rounded-full tracking-wider uppercase text-sm hover:bg-gold/10 transition-all duration-300">
                Contact Us
            </a>
        </div>
    </section>

</div>
@endsection
