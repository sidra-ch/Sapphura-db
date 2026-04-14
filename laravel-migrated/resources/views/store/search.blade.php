@extends('layouts.app')
@section('title', 'Search – Sapphura')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <h1 class="text-3xl font-bold text-center mb-8">Search</h1>
    <form method="GET" action="/search" class="mb-10">
        <div class="flex gap-3">
            <input type="text" name="q" value="{{ $q }}" placeholder="Search for products..." autofocus
                   class="flex-1 px-5 py-3 rounded-lg bg-navy-soft border border-gold/20 text-cream placeholder-cream/30 focus:outline-none focus:border-gold text-sm">
            <button type="submit" class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Search</button>
        </div>
    </form>

    @if($q)
        <p class="text-sm text-cream/50 mb-6">{{ $products->count() }} results for "<span class="text-gold">{{ $q }}</span>"</p>
        @if($products->count())
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($products as $product)
                    @include('partials.product-card', ['product' => $product])
                @endforeach
            </div>
        @else
            <div class="text-center py-16">
                <svg class="w-16 h-16 text-cream/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <p class="text-cream/50">No products found. Try different keywords.</p>
            </div>
        @endif
    @endif
</div>
@endsection
