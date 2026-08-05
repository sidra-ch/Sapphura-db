@extends('layouts.app')
@section('title', $product->name . ' – Sapphura')
@section('description', Str::limit(strip_tags($product->description ?? $product->name), 160))
@section('og_type', 'product')
@section('og_image', $product->primaryImageUrl())

@section('content')
@php
    $mediaItems = $product->mediaItems();
    $images = array_values(array_filter($mediaItems, fn ($item) => $item['type'] === 'image'));
    $firstImage = $images[0]['url'] ?? null;
    $primaryDisplayImage = $firstImage ?? asset('/logo-1.png');
    $ogImage = $firstImage ?? asset('/logo-1.png');
@endphp

{{-- Product JSON-LD --}}
<script type="application/ld+json">
{
    "@@context": "https://schema.org",
    "@type": "Product",
    "name": @json($product->name),
    "description": @json(Str::limit(strip_tags($product->description ?? $product->name), 300)),
    "image": @json($firstImage ? [$firstImage] : []),
    "brand": { "@type": "Brand", "name": "Sapphura" },
    "url": "{{ url('/product/' . $product->slug) }}",
    "offers": {
        "@type": "Offer",
        "price": @json($product->price),
        "priceCurrency": "PKR",
        "availability": "{{ $product->stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }}",
        "url": "{{ url('/product/' . $product->slug) }}"
    }@if($product->reviews->count())
    ,"aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": @json(round($product->reviews->avg('rating'), 1)),
        "reviewCount": @json($product->reviews->count())
    }
    @endif
}
</script>
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10">
    @php
        $breadcrumbItems = [
            ['label' => 'Shop', 'url' => '/collections'],
        ];
        if ($product->category) {
            $breadcrumbItems[] = ['label' => $product->category->name, 'url' => '/collections?category=' . urlencode($product->category->name)];
        }
        $breadcrumbItems[] = ['label' => $product->name];
    @endphp
    @include('partials.breadcrumb', ['items' => $breadcrumbItems])

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" x-data="{
        mediaItems: {{ json_encode($mediaItems) }},
        selectedMedia: 0,
        qty: 1,
        selectedVariant: null,
        lightboxOpen: false,
        lensVisible: false,
        lensX: 0,
        lensY: 0,
        lensBgPos: '50% 50%',
        get activeMedia() {
            return this.mediaItems[this.selectedMedia] || null;
        },
        get activeImage() {
            return this.activeMedia && this.activeMedia.type === 'image' ? this.activeMedia.url : '';
        },
        get activeMediaUrl() {
            return this.activeMedia ? this.activeMedia.url : '';
        },
        get activeMediaType() {
            return this.activeMedia ? this.activeMedia.type : 'image';
        },
        updateLens(event) {
            if (!this.activeImage || this.activeMediaType !== 'image') return;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
            const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

            this.lensX = x;
            this.lensY = y;
            this.lensBgPos = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
            this.lensVisible = true;
        },
        openLightbox() {
            this.lightboxOpen = true;
            document.body.style.overflow = 'hidden';
        },
        closeLightbox() {
            this.lightboxOpen = false;
            document.body.style.overflow = '';
        },
        nextImage() {
            if (this.mediaItems.length < 2) return;
            this.selectedMedia = (this.selectedMedia + 1) % this.mediaItems.length;
        },
        prevImage() {
            if (this.mediaItems.length < 2) return;
            this.selectedMedia = (this.selectedMedia - 1 + this.mediaItems.length) % this.mediaItems.length;
        }
    }">
        {{-- Images --}}
        <div class="lg:sticky lg:top-28 lg:self-start">
            <div class="group relative aspect-square rounded-xl overflow-hidden glass mb-4"
                 @mousemove="updateLens($event)"
                 @mouseenter="lensVisible = true"
                 @mouseleave="lensVisible = false">
                @if(count($mediaItems) > 0)
                    <template x-for="(item, idx) in mediaItems" :key="idx">
                        <div x-show="selectedMedia === idx" class="w-full h-full">
                            <template x-if="item.type === 'video'">
                                <video :src="item.url" class="w-full h-full object-cover bg-black" controls preload="metadata"></video>
                            </template>
                            <template x-if="item.type !== 'video'">
                                <img :src="item.url" alt="{{ $product->name }}" class="w-full h-full object-cover transition duration-500 group-hover:scale-110 cursor-zoom-in" @click="openLightbox()">
                            </template>
                        </div>
                    </template>
                    <div x-show="lensVisible && activeMediaType === 'image'"
                         x-cloak
                         class="pointer-events-none absolute z-20 hidden lg:block w-36 h-36 rounded-full border border-gold/50 shadow-xl"
                         :style="`left:${lensX - 72}px; top:${lensY - 72}px; background-image:url('${activeImage}'); background-size:240%; background-position:${lensBgPos};`">
                    </div>
                    <button x-show="activeMediaType === 'image'" type="button" @click="openLightbox()" class="absolute bottom-3 right-3 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] rounded-full bg-navy/70 border border-gold/30 text-gold hover:bg-navy transition">
                        Zoom
                    </button>
                @else
                    <div class="w-full h-full flex items-center justify-center text-cream/20">
                        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                @endif
            </div>
            @if(count($mediaItems) > 1)
                <div class="flex gap-3">
                    @foreach($mediaItems as $idx => $item)
                        <button @click="selectedMedia = {{ $idx }}"
                                :class="selectedMedia === {{ $idx }} ? 'border-gold' : 'border-gold/20'"
                                class="w-20 h-20 rounded-lg overflow-hidden border-2 transition">
                            @if($item['type'] === 'video')
                                <div class="relative w-full h-full bg-black">
                                    <video src="{{ $item['url'] }}" class="w-full h-full object-cover" muted preload="metadata"></video>
                                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-[10px]">Play</div>
                                </div>
                            @else
                                <img src="{{ $item['url'] }}" alt="" class="w-full h-full object-cover">
                            @endif
                        </button>
                    @endforeach
                </div>
            @endif

            @if(count($mediaItems) > 0)
                <div x-show="lightboxOpen" x-cloak class="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm p-4 flex items-center justify-center" @click.self="closeLightbox()" @keydown.escape.window="closeLightbox()" style="display:none;">
                    <button type="button" @click="closeLightbox()" class="absolute top-5 right-5 text-cream/80 hover:text-gold transition">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>

                    @if(count($mediaItems) > 1)
                        <button type="button" @click="prevImage()" class="absolute left-4 sm:left-8 text-cream/80 hover:text-gold transition">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                    @endif

                    <template x-if="activeMediaType === 'video'">
                        <video :src="activeMediaUrl" class="max-h-[88vh] max-w-[92vw] rounded-lg shadow-2xl" controls autoplay></video>
                    </template>
                    <template x-if="activeMediaType !== 'video'">
                        <img :src="activeMediaUrl" alt="{{ $product->name }}" class="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl">
                    </template>

                    @if(count($mediaItems) > 1)
                        <button type="button" @click="nextImage()" class="absolute right-4 sm:right-8 text-cream/80 hover:text-gold transition">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    @endif
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

            {{-- Size Chart (Stitch Suits only) --}}
            @if(($product->category->name ?? '') === 'Stitch Suits')
            <div class="mb-6" x-data="{ open: false }">
                <button type="button" @click="open = !open"
                        class="flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition mb-3"
                        style="color:rgba(212,175,55,0.85);">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"/>
                    </svg>
                    <span x-text="open ? 'Hide Size Chart ^' : 'View Size Chart v'">View Size Chart v</span>
                </button>
                <div x-show="open" x-transition class="rounded-xl overflow-hidden" style="border:1px solid rgba(212,175,55,0.15);">
                    <div class="grid grid-cols-1 sm:grid-cols-2">
                        <div class="p-3 border-b sm:border-b-0 sm:border-r" style="border-color:rgba(212,175,55,0.12);">
                            <p class="text-[10px] uppercase tracking-widest mb-2" style="color:rgba(212,175,55,0.5);">Shirt / Kameez</p>
                            <img src="/stitch%20suit/stitch-size.jpeg" alt="Shirt Size Chart" class="w-full rounded-lg">
                        </div>
                        <div class="p-3">
                            <p class="text-[10px] uppercase tracking-widest mb-2" style="color:rgba(212,175,55,0.5);">Trouser</p>
                            <img src="/stitch%20suit/trouser-size.jpeg" alt="Trouser Size Chart" class="w-full rounded-lg">
                        </div>
                    </div>
                    <div class="px-3 py-2" style="background:rgba(0,0,0,0.3);">
                        <p class="text-[10px]" style="color:rgba(255,247,239,0.3);">Measurements in inches. For custom fit, add note at checkout.</p>
                    </div>
                </div>
            </div>
            @endif

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
                    <button @click="qty = Math.max(1, qty - 1)" class="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition text-lg">-</button>
                    <span class="w-12 text-center font-bold" x-text="qty"></span>
                    <button @click="qty++" class="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition text-lg">+</button>
                </div>
            </div>

            {{-- Add to Cart --}}
            <div class="flex gap-3 mb-6" id="main-add-to-cart-wrapper">
                <button id="main-add-to-cart" @click="$store.cart.add({
                    id: '{{ $product->public_id ?: $product->id }}' + (selectedVariant ? '-' + selectedVariant.id : ''),
                    productId: {{ $product->id }},
                    slug: '{{ $product->slug }}',
                    name: '{{ addslashes($product->name) }}',
                    image: '{{ $primaryDisplayImage }}',
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
                    image: '{{ $primaryDisplayImage }}',
                    price: {{ $product->sale_price ?: $product->price }}
                })" class="w-12 h-12 border border-gold/30 rounded-lg flex items-center justify-center hover:bg-gold/10 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                </button>
            </div>

            {{-- Trust signals --}}
            <div class="glass rounded-lg p-4 flex items-center justify-center gap-6 text-xs text-cream/50">
                <span>* Free Shipping</span>
                <span>* Easy Returns</span>
                <span>* 3-5 Days Delivery</span>
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

