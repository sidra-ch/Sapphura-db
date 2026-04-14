{{-- Product Card Partial --}}
<div x-data class="group luxury-card rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5">
    <a href="/product/{{ $product->slug }}" class="block relative overflow-hidden aspect-square bg-navy-soft">
        @php $images = json_decode($product->images ?: '[]', true); @endphp
        @if(!empty($images))
            <img src="{{ $images[0] }}" alt="{{ $product->name }}"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 loading="lazy">
        @else
            <div class="w-full h-full flex items-center justify-center text-cream/20">
                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
        @endif
        @if($product->sale_price)
            <span class="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">SALE</span>
        @endif
        @if($product->is_featured)
            <span class="absolute top-3 right-3 bg-gold text-ink text-xs px-2 py-1 rounded-full font-bold">Best Seller</span>
        @endif
    </a>
    <div class="p-4">
        <p class="text-xs text-gold/60 uppercase tracking-wider mb-1">{{ $product->category->name ?? '' }}</p>
        <a href="/product/{{ $product->slug }}" class="block">
            <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-gold transition">{{ $product->name }}</h3>
        </a>
        <div class="flex items-center gap-2 mt-2">
            @if($product->sale_price)
                <span class="text-gold font-bold">Rs. {{ number_format($product->sale_price) }}</span>
                <span class="text-cream/40 text-sm line-through">Rs. {{ number_format($product->price) }}</span>
            @else
                <span class="text-gold font-bold">Rs. {{ number_format($product->price) }}</span>
            @endif
        </div>
        <div class="flex gap-2 mt-3">
            <button @click="$store.cart.add({
                id: '{{ $product->public_id ?: $product->id }}',
                productId: {{ $product->id }},
                slug: '{{ $product->slug }}',
                name: '{{ addslashes($product->name) }}',
                image: '{{ $images[0] ?? '' }}',
                price: {{ $product->sale_price ?: $product->price }},
                quantity: 1,
                variant: ''
            })" class="flex-1 py-2 bg-gradient-to-r from-gold to-gold-light text-ink font-bold text-xs rounded-lg hover:shadow-lg hover:shadow-gold/20 transition tracking-wider uppercase">
                Add to Cart
            </button>
            <button @click="$store.wishlist.toggle({
                id: '{{ $product->public_id ?: $product->id }}',
                slug: '{{ $product->slug }}',
                name: '{{ addslashes($product->name) }}',
                image: '{{ $images[0] ?? '' }}',
                price: {{ $product->sale_price ?: $product->price }}
            })" class="w-10 h-10 border border-gold/30 rounded-lg flex items-center justify-center hover:bg-gold/10 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
        </div>
    </div>
</div>
