{{-- Enhanced Product Card Partial --}}
<div x-data="{ showQuickView: false }" class="group luxury-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
    {{-- Image Section --}}
    <div class="relative overflow-hidden aspect-[3/4] bg-navy-soft">
        <a href="/product/{{ $product->slug }}" class="block h-full">
            @php $images = json_decode($product->images ?: '[]', true); @endphp
            
            {{-- Primary Image --}}
            @if(!empty($images))
                <img src="{{ $images[0] }}" alt="{{ $product->name }}"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     loading="lazy">
            @else
                <div class="w-full h-full flex items-center justify-center text-cream/20">
                    <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
            @endif

            {{-- Hover Secondary Image --}}
            @if(!empty($images) && count($images) > 1)
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <img src="{{ $images[1] }}" alt="{{ $product->name }} - Secondary"
                         class="w-full h-full object-cover"
                         loading="lazy">
                </div>
            @endif
        </a>

        {{-- Badges --}}
        <div class="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
            <div class="flex flex-col gap-2">
                @if($product->sale_price && $product->sale_price < $product->price)
                    <span class="inline-flex items-center gap-1 bg-red-500/90 backdrop-blur text-white text-[9px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.75l.108.464.464.108a1 1 0 010 1.936l-.464.108-.108.464a1 1 0 11-1.934-.194l.108-.464-.464-.108a1 1 0 010-1.936l.464-.108.108-.464A1 1 0 0112 2z" clip-rule="evenodd"/></svg>
                        On Sale
                    </span>
                @endif
                @if($product->is_featured)
                    <span class="inline-flex items-center gap-1 bg-gold/90 backdrop-blur text-ink text-[9px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        Bestseller
                    </span>
                @endif
                @if($product->created_at > now()->subDays(30))
                    <span class="inline-flex items-center gap-1 bg-blue-500/90 backdrop-blur text-white text-[9px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"/></svg>
                        New
                    </span>
                @endif
            </div>

            {{-- Wishlist Button (Top Right) --}}
            <button @click="showQuickView = !showQuickView"
                    @click.stop="$store.wishlist.toggle({
                        id: '{{ $product->public_id ?: $product->id }}',
                        slug: '{{ $product->slug }}',
                        name: '{{ addslashes($product->name) }}',
                        image: '{{ $images[0] ?? '' }}',
                        price: {{ $product->sale_price ?: $product->price }}
                    })"
                    :class="$store.wishlist.has('{{ $product->public_id ?: $product->id }}') ? 'bg-red-500/90 text-white' : 'bg-white/90 text-red-500 hover:bg-red-500/90 hover:text-white'"
                    class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur">
                <svg class="w-5 h-5" fill="currentColor" stroke="currentColor" stroke-width="0" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        </div>

        {{-- Quick View Button --}}
        <button @click="showQuickView = true"
                class="absolute bottom-0 left-0 right-0 py-3 bg-gradient-to-t from-navy to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 text-cream text-[10px] uppercase tracking-[0.2em] font-semibold hover:from-gold hover:to-gold/50 hover:text-ink">
            Quick View
        </button>
    </div>

    {{-- Info Section --}}
    <div class="p-5">
        <p class="text-[8px] text-gold/60 uppercase tracking-[0.3em] font-light mb-2">{{ $product->category->name ?? 'Collection' }}</p>
        
        <a href="/product/{{ $product->slug }}" class="block mb-3 group/title">
            <h3 class="font-light text-sm line-clamp-2 text-cream group-hover/title:text-gold transition-colors">{{ $product->name }}</h3>
        </a>

        {{-- Color Swatches --}}
        @php $variants = $product->variants ?? []; @endphp
        @if($variants->isNotEmpty() && $variants->where('name', 'Color')->count() > 0)
            <div class="mb-3 flex items-center gap-2">
                @foreach($variants->where('name', 'Color')->take(4) as $variant)
                    <button class="w-5 h-5 rounded-full border-2 border-cream/20 hover:border-cream/60 transition-all"
                            title="{{ $variant->value }}"
                            style="background-color: {{ $variant->sku ?: '#d4af37' }}; opacity:0.8;"
                            onmouseover="this.style.opacity='1'; this.style.transform='scale(1.1)';"
                            onmouseout="this.style.opacity='0.8'; this.style.transform='scale(1)';"></button>
                @endforeach
                @if($variants->where('name', 'Color')->count() > 4)
                    <span class="text-[8px] text-cream/40">+{{ $variants->where('name', 'Color')->count() - 4 }}</span>
                @endif
            </div>
        @endif

        {{-- Price --}}
        <div class="mb-4">
            @if($product->sale_price && $product->sale_price < $product->price)
                <div class="flex items-baseline gap-2">
                    <span class="text-base font-bold text-gold">Rs. {{ number_format($product->sale_price) }}</span>
                    <span class="text-xs text-cream/40 line-through">Rs. {{ number_format($product->price) }}</span>
                    <span class="text-[8px] text-red-400 font-semibold">
                        -{{ round(((($product->price - $product->sale_price) / $product->price) * 100)) }}%
                    </span>
                </div>
            @else
                <span class="text-base font-bold text-gold">Rs. {{ number_format($product->price) }}</span>
            @endif
        </div>

        {{-- Rating --}}
        @php 
            $avgRating = $product->reviews()->where('is_approved', true)->avg('rating') ?? 0;
            $reviewCount = $product->reviews()->where('is_approved', true)->count();
        @endphp
        @if($reviewCount > 0)
            <div class="mb-4 flex items-center gap-2">
                <div class="flex items-center gap-0.5">
                    @for($i = 0; $i < 5; $i++)
                        <svg class="w-3 h-3" fill="{{ $i < round($avgRating) ? 'currentColor' : 'none' }}" stroke="currentColor" stroke-width="2" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" style="color:#d4af37;"/>
                        </svg>
                    @endfor
                </div>
                <span class="text-[8px] text-cream/50">({{ $reviewCount }})</span>
            </div>
        @endif

        {{-- CTA Buttons --}}
        <div class="flex gap-2">
            <button @click="$store.cart.add({
                id: '{{ $product->public_id ?: $product->id }}',
                productId: {{ $product->id }},
                slug: '{{ $product->slug }}',
                name: '{{ addslashes($product->name) }}',
                image: '{{ $images[0] ?? '' }}',
                price: {{ $product->sale_price ?: $product->price }},
                quantity: 1,
                variant: ''
            })"
            class="flex-1 py-2.5 bg-gold text-ink font-semibold text-[9px] rounded-lg hover:shadow-lg hover:shadow-gold/30 transition-all uppercase tracking-widest">
                + Add
            </button>
            <a href="/product/{{ $product->slug }}"
               class="flex-1 py-2.5 border border-gold/30 text-gold hover:bg-gold/10 font-semibold text-[9px] rounded-lg transition-all uppercase tracking-widest">
                View
            </a>
        </div>
    </div>
</div>
