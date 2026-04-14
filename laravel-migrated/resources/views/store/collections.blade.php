@extends('layouts.app')
@section('title', 'Collections – Sapphura')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold">Our Collections</h1>
        <p class="text-cream/50 mt-2">Discover luxury pieces crafted for you</p>
    </div>

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
                        <option value="price_asc" {{ request('sort') === 'price_asc' ? 'selected' : '' }}>Price: Low → High</option>
                        <option value="price_desc" {{ request('sort') === 'price_desc' ? 'selected' : '' }}>Price: High → Low</option>
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
