@extends('layouts.app')
@section('title', $product->name . ' – Sapphura')

@section('content')
@php $images = json_decode($product->images ?: '[]', true); @endphp
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    {{-- Breadcrumb --}}
    <nav class="text-sm text-cream/40 mb-8">
        <a href="/" class="hover:text-gold transition">Home</a>
        <span class="mx-2">/</span>
        <a href="/collections" class="hover:text-gold transition">Shop</a>
        <span class="mx-2">/</span>
        <a href="/collections?category={{ urlencode($product->category->name ?? '') }}" class="hover:text-gold transition">{{ $product->category->name ?? '' }}</a>
        <span class="mx-2">/</span>
        <span class="text-cream">{{ $product->name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" x-data="{ selectedImage: 0, qty: 1, selectedVariant: null }">
        {{-- Images --}}
        <div>
            <div class="aspect-square rounded-xl overflow-hidden glass mb-4">
                @if(count($images) > 0)
                    <template x-for="(img, idx) in {{ json_encode($images) }}" :key="idx">
                        <img x-show="selectedImage === idx" :src="img" alt="{{ $product->name }}" class="w-full h-full object-cover">
                    </template>
                @else
                    <div class="w-full h-full flex items-center justify-center text-cream/20">
                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                @endif
            </div>
            @if(count($images) > 1)
                <div class="flex gap-3">
                    @foreach($images as $idx => $img)
                        <button @click="selectedImage = {{ $idx }}"
                                :class="selectedImage === {{ $idx }} ? 'border-gold' : 'border-gold/20'"
                                class="w-20 h-20 rounded-lg overflow-hidden border-2 transition">
                            <img src="{{ $img }}" alt="" class="w-full h-full object-cover">
                        </button>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Product Info --}}
        <div>
            <div class="flex gap-2 mb-3">
                @if($product->is_featured)
                    <span class="px-3 py-1 text-xs bg-gold text-ink rounded-full font-bold">Best Seller</span>
                @endif
                <span class="px-3 py-1 text-xs rounded-full font-bold {{ $product->stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400' }}">
                    {{ $product->stock > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
            </div>

            <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ $product->name }}</h1>
            <p class="text-sm text-cream/40 mb-4">{{ $product->category->name ?? '' }}</p>

            <div class="flex items-center gap-3 mb-6">
                @if($product->sale_price)
                    <span class="text-3xl font-bold text-gold">Rs. {{ number_format($product->sale_price) }}</span>
                    <span class="text-lg text-cream/40 line-through">Rs. {{ number_format($product->price) }}</span>
                    @php $discount = round((1 - $product->sale_price / $product->price) * 100); @endphp
                    <span class="text-sm text-red-400 font-bold">-{{ $discount }}%</span>
                @else
                    <span class="text-3xl font-bold text-gold">Rs. {{ number_format($product->price) }}</span>
                @endif
            </div>

            <p class="text-cream/60 leading-relaxed mb-6">{{ $product->description }}</p>

            {{-- Variants --}}
            @if($product->variants->count())
                <div class="mb-6">
                    <h4 class="text-xs uppercase tracking-widest text-gold font-bold mb-3">Select Variant</h4>
                    <div class="flex flex-wrap gap-2">
                        @foreach($product->variants as $variant)
                            <button @click="selectedVariant = {{ json_encode($variant) }}"
                                    :class="selectedVariant?.id === {{ $variant->id }} ? 'border-gold bg-gold/10' : 'border-gold/20'"
                                    class="px-4 py-2 rounded-lg border text-sm transition hover:border-gold">
                                {{ $variant->size ?? '' }} {{ $variant->color ?? '' }} {{ $variant->material ?? '' }}
                                @if($variant->price != $product->price) - Rs. {{ number_format($variant->price) }} @endif
                            </button>
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- Quantity --}}
            <div class="mb-6">
                <h4 class="text-xs uppercase tracking-widest text-gold font-bold mb-3">Quantity</h4>
                <div class="flex items-center gap-3">
                    <button @click="qty = Math.max(1, qty - 1)" class="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition text-lg">−</button>
                    <span class="w-12 text-center font-bold" x-text="qty"></span>
                    <button @click="qty++" class="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition text-lg">+</button>
                </div>
            </div>

            {{-- Add to Cart --}}
            <div class="flex gap-3 mb-6">
                <button @click="$store.cart.add({
                    id: '{{ $product->public_id ?: $product->id }}' + (selectedVariant ? '-' + selectedVariant.id : ''),
                    productId: {{ $product->id }},
                    slug: '{{ $product->slug }}',
                    name: '{{ addslashes($product->name) }}',
                    image: '{{ $images[0] ?? '' }}',
                    price: selectedVariant ? selectedVariant.price : {{ $product->sale_price ?: $product->price }},
                    quantity: qty,
                    variant: selectedVariant ? (selectedVariant.size || '') + ' ' + (selectedVariant.color || '') : ''
                })" {{ $product->stock <= 0 ? 'disabled' : '' }}
                class="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg hover:shadow-lg hover:shadow-gold/20 transition text-sm tracking-wider uppercase disabled:opacity-50">
                    {{ $product->stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
                </button>
                <button @click="$store.wishlist.toggle({
                    id: '{{ $product->public_id ?: $product->id }}',
                    slug: '{{ $product->slug }}',
                    name: '{{ addslashes($product->name) }}',
                    image: '{{ $images[0] ?? '' }}',
                    price: {{ $product->sale_price ?: $product->price }}
                })" class="w-12 h-12 border border-gold/30 rounded-lg flex items-center justify-center hover:bg-gold/10 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
            </div>

            {{-- Trust signals --}}
            <div class="glass rounded-lg p-4 flex items-center justify-center gap-6 text-xs text-cream/50">
                <span>✦ Free Shipping</span>
                <span>✦ Easy Returns</span>
                <span>✦ 3-5 Days Delivery</span>
            </div>
        </div>
    </div>

    {{-- Reviews --}}
    <section class="mt-16">
        <h2 class="text-2xl font-bold mb-8">Customer Reviews</h2>
        @if($reviews->count())
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($reviews as $review)
                    <div class="glass rounded-xl p-5">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-semibold text-sm">{{ $review->user->name ?? 'Customer' }}</span>
                            <div class="flex gap-0.5">
                                @for($i = 0; $i < $review->rating; $i++)
                                    <svg class="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                @endfor
                            </div>
                        </div>
                        <p class="text-sm text-cream/60">{{ $review->comment }}</p>
                    </div>
                @endforeach
            </div>
        @else
            <p class="text-cream/40 text-center py-8">No reviews yet. Be the first to review this product!</p>
        @endif
    </section>

    {{-- Related Products --}}
    @if($related->count())
        <section class="mt-16">
            <h2 class="text-2xl font-bold mb-8">You May Also Like</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                @foreach($related as $product)
                    @include('partials.product-card', ['product' => $product])
                @endforeach
            </div>
        </section>
    @endif
</div>
@endsection
