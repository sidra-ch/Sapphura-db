@extends('layouts.app')
@section('title', request('category') ? request('category') . ' - Sapphura' : 'Collections - Sapphura')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">

    {{-- Stitch Suits Hero Banner (only when category=Stitch Suits) --}}
    @if(request('category') === 'Stitch Suits')
    <div class="relative overflow-hidden rounded-2xl mb-8"
         style="background:#07090b; border:1px solid rgba(212,175,55,0.15);">
        {{-- Atmospheric glow --}}
        <div class="pointer-events-none absolute inset-0"
             style="background: radial-gradient(ellipse 60% 50% at 80% 50%, rgba(212,175,55,0.07) 0%, transparent 70%);"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
            {{-- Left: heading --}}
            <div class="flex-1">
                <p class="text-[9px] uppercase tracking-[0.5em] mb-3 flex items-center gap-2"
                   style="color:rgba(212,175,55,0.5);">
                    <span class="inline-block h-px w-5" style="background:rgba(212,175,55,0.35);"></span>
                    Stitched Collection 2026
                </p>
                <h1 class="font-light leading-[0.9]"
                    style="font-family:Georgia,serif; font-size:clamp(2rem,4.5vw,3.8rem); color:#fff7ef;">
                    Stitch Suits<br>
                    <em style="font-style:italic; -webkit-text-stroke:1px rgba(212,175,55,0.55); color:transparent;">Edit.</em>
                </h1>
                <p class="mt-3 text-sm" style="color:rgba(255,247,239,0.38); max-width:340px;">
                    Premium stitched suits - select any design, choose your size, and order directly.
                </p>
                {{-- Size chart toggle --}}
                <button type="button"
                        onclick="document.getElementById('size-chart').classList.toggle('hidden')"
                        class="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.28em] transition-all"
                        style="border:1px solid rgba(212,175,55,0.4); color:rgba(212,175,55,0.85); background:rgba(212,175,55,0.06);"
                        onmouseover="this.style.background='rgba(212,175,55,0.15)';"
                        onmouseout="this.style.background='rgba(212,175,55,0.06)';">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"/>
                    </svg>
                    View Size Chart
                </button>
            </div>
            {{-- Right: mini size chart thumbnails --}}
            <div class="flex gap-3 flex-shrink-0">
                <div class="relative overflow-hidden rounded-xl cursor-pointer"
                     style="border:1px solid rgba(212,175,55,0.15);"
                     onclick="document.getElementById('size-chart').classList.toggle('hidden')">
                    <img src="/stitch%20suit/stitch-size.jpeg" alt="Shirt Size Chart"
                         class="w-24 h-28 md:w-28 md:h-32 object-cover opacity-70 hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 left-0 right-0 py-1 text-center text-[8px] uppercase tracking-widest"
                         style="background:rgba(0,0,0,0.65); color:rgba(212,175,55,0.7);">Shirt</div>
                </div>
                <div class="relative overflow-hidden rounded-xl cursor-pointer"
                     style="border:1px solid rgba(212,175,55,0.15);"
                     onclick="document.getElementById('size-chart').classList.toggle('hidden')">
                    <img src="/stitch%20suit/trouser-size.jpeg" alt="Trouser Size Chart"
                         class="w-24 h-28 md:w-28 md:h-32 object-cover opacity-70 hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-0 left-0 right-0 py-1 text-center text-[8px] uppercase tracking-widest"
                         style="background:rgba(0,0,0,0.65); color:rgba(212,175,55,0.7);">Trouser</div>
                </div>
            </div>
        </div>

        {{-- Expandable size chart --}}
        <div id="size-chart" class="hidden border-t px-6 pb-6 pt-4" style="border-color:rgba(212,175,55,0.1);">
            <p class="text-[10px] uppercase tracking-[0.38em] mb-4" style="color:rgba(212,175,55,0.5);">Size Reference Charts</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <p class="text-xs text-cream/50 mb-2">Shirt / Kameez Size Chart</p>
                    <img src="/stitch%20suit/stitch-size.jpeg" alt="Shirt Size Chart"
                         class="w-full rounded-xl" style="border:1px solid rgba(212,175,55,0.12);">
                </div>
                <div>
                    <p class="text-xs text-cream/50 mb-2">Trouser Size Chart</p>
                    <img src="/stitch%20suit/trouser-size.jpeg" alt="Trouser Size Chart"
                         class="w-full rounded-xl" style="border:1px solid rgba(212,175,55,0.12);">
                </div>
            </div>
            <p class="text-[10px] text-cream/30 mt-3">
                Measure in inches. If between sizes, order the larger size. For custom stitching, add size note in order comments.
            </p>
        </div>
    </div>
    @else
    <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold">Our Collections</h1>
        <p class="text-cream/50 mt-2">Discover luxury pieces crafted for you</p>
    </div>
    @endif

    <div class="flex flex-col lg:flex-row gap-8">
        {{-- Filters Sidebar --}}
        <aside x-data="{ open: false }" class="lg:w-64 flex-shrink-0">
            <button @click="open = !open" class="lg:hidden w-full mb-4 py-2 glass rounded-lg text-sm flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                Filters
            </button>
            <form method="GET" action="/collections" :class="open ? '' : 'hidden lg:block'" class="glass rounded-xl p-5 space-y-6">
                {{-- Category --}}
                <div>
                    <h4 class="text-xs uppercase tracking-widest text-gold font-bold mb-3">Category</h4>
                    <div class="space-y-2">
                        @foreach($categories as $cat)
                            <label class="flex items-center gap-2 text-sm cursor-pointer hover:text-gold transition">
                                <input type="radio" name="category" value="{{ $cat->name }}" {{ request('category') === $cat->name ? 'checked' : '' }}
                                       class="accent-[#d4af37]">
                                {{ $cat->name }}
                            </label>
                        @endforeach
                    </div>
                </div>
                {{-- Price --}}
                <div>
                    <h4 class="text-xs uppercase tracking-widest text-gold font-bold mb-3">Price Range</h4>
                    <div class="flex gap-2">
                        <input type="number" name="min_price" value="{{ request('min_price') }}" placeholder="Min" class="w-full px-3 py-2 rounded bg-navy border border-gold/20 text-cream text-sm focus:outline-none focus:border-gold">
                        <input type="number" name="max_price" value="{{ request('max_price') }}" placeholder="Max" class="w-full px-3 py-2 rounded bg-navy border border-gold/20 text-cream text-sm focus:outline-none focus:border-gold">
                    </div>
                </div>
                {{-- Sort --}}
                <div>
                    <h4 class="text-xs uppercase tracking-widest text-gold font-bold mb-3">Sort By</h4>
                    <select name="sort" class="w-full px-3 py-2 rounded bg-navy border border-gold/20 text-cream text-sm focus:outline-none focus:border-gold [&>option]:text-black [&>option]:bg-white">
                        <option value="newest" {{ request('sort') === 'newest' ? 'selected' : '' }}>Newest</option>
                        <option value="price_asc" {{ request('sort') === 'price_asc' ? 'selected' : '' }}>Price: Low to High</option>
                        <option value="price_desc" {{ request('sort') === 'price_desc' ? 'selected' : '' }}>Price: High to Low</option>
                    </select>
                </div>
                <div class="flex gap-2">
                    <button type="submit" class="flex-1 py-2 bg-gradient-to-r from-gold to-gold-light text-ink font-bold text-sm rounded-lg">Apply</button>
                    <a href="/collections" class="px-4 py-2 border border-gold/30 text-gold text-sm rounded-lg hover:bg-gold/10 transition">Clear</a>
                </div>
            </form>
        </aside>

        {{-- Product Grid --}}
        <div class="flex-1">
            <div class="flex items-center justify-between mb-6">
                <p class="text-sm text-cream/50">{{ $products->total() }} products</p>
            </div>
            @if($products->count())
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    @foreach($products as $product)
                        @include('partials.product-card', ['product' => $product])
                    @endforeach
                </div>
                <div class="mt-10">{{ $products->links() }}</div>
            @else
                <div class="text-center py-20">
                    <svg class="w-16 h-16 text-cream/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p class="text-cream/50">No products found</p>
                    <a href="/collections" class="text-gold hover:underline text-sm mt-2 inline-block">Clear filters</a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

