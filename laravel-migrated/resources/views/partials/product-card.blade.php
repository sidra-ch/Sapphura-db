{{-- Enhanced Product Card Partial --}}
@php
    $rawImages = json_decode($product->images ?: '[]', true);
    $variants = $product->variants ?? collect();
    $images = collect(is_array($rawImages) ? $rawImages : [])
        ->map(fn ($img) => is_string($img) ? trim($img) : '')
        ->filter()
        ->map(function ($img) {
            if (\Illuminate\Support\Str::startsWith($img, ['http://', 'https://', '//', 'data:', '/'])) {
                return $img;
            }

            return '/' . ltrim($img, '/');
        })
        ->values()
        ->all();

    $primaryImage = $images[0] ?? asset('/logo-1.png');
    $secondaryImage = $images[1] ?? null;
    $variantOptions = $variants->map(function ($variant) use ($product) {
        $variantImage = is_string($variant->image ?? null) ? trim($variant->image) : '';
        if ($variantImage !== '' && !\Illuminate\Support\Str::startsWith($variantImage, ['http://', 'https://', '//', 'data:', '/'])) {
            $variantImage = '/' . ltrim($variantImage, '/');
        }

        return [
            'id' => $variant->id,
            'label' => trim(collect([$variant->size, $variant->color, $variant->material])->filter()->implode(' ')),
            'price' => $variant->price ?: ($product->sale_price ?: $product->price),
            'stock' => (int) ($variant->stock ?? 0),
            'image' => $variantImage ?: null,
        ];
    })->values()->all();
@endphp
<div x-data="{
    showQuickView: false,
    selectedQuickImage: 0,
    selectedVariantId: null,
    currentQuickImage: null,
    qty: 1,
    quickViewImages: @js($images),
    quickViewVariants: @js($variantOptions),
    basePrice: {{ $product->sale_price ?: $product->price }},
    lockBodyScroll() {
        const currentLocks = Number(document.body.dataset.modalLocks || '0');
        const nextLocks = currentLocks + 1;
        document.body.dataset.modalLocks = String(nextLocks);
        document.body.style.overflow = 'hidden';
    },
    unlockBodyScroll() {
        const currentLocks = Number(document.body.dataset.modalLocks || '0');
        const nextLocks = Math.max(0, currentLocks - 1);
        if (nextLocks === 0) {
            document.body.style.overflow = '';
            delete document.body.dataset.modalLocks;
            return;
        }
        document.body.dataset.modalLocks = String(nextLocks);
    },
    openQuickView() {
        if (this.showQuickView) return;
        this.showQuickView = true;
        this.selectedQuickImage = 0;
        this.selectedVariantId = null;
        this.currentQuickImage = null;
        this.qty = 1;
        this.lockBodyScroll();
    },
    closeQuickView() {
        if (!this.showQuickView) return;
        this.showQuickView = false;
        this.currentQuickImage = null;
        this.unlockBodyScroll();
    },
    prevQuickImage() {
        if (!this.quickViewImages.length) return;
        this.currentQuickImage = null;
        this.selectedQuickImage = (this.selectedQuickImage - 1 + this.quickViewImages.length) % this.quickViewImages.length;
    },
    nextQuickImage() {
        if (!this.quickViewImages.length) return;
        this.currentQuickImage = null;
        this.selectedQuickImage = (this.selectedQuickImage + 1) % this.quickViewImages.length;
    },
    selectVariant(id) {
        this.selectedVariantId = this.selectedVariantId === id ? null : id;
        if (!this.selectedVariant) {
            this.currentQuickImage = null;
            return;
        }

        this.currentQuickImage = this.selectedVariant.image || null;
    },
    get selectedVariant() {
        return this.quickViewVariants.find((variant) => variant.id === this.selectedVariantId) || null;
    },
    get modalPrice() {
        return this.selectedVariant ? this.selectedVariant.price : this.basePrice;
    },
    get selectedVariantLabel() {
        return this.selectedVariant ? this.selectedVariant.label : '';
    },
    get activeQuickImage() {
        return this.currentQuickImage || this.quickViewImages[this.selectedQuickImage] || '{{ $primaryImage }}';
    }
}" class="group luxury-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
    {{-- Image Section (Strict Aspect Ratio 3/4) --}}
    <div class="relative overflow-hidden aspect-[3/4] bg-navy-soft flex-shrink-0">
        <a href="/product/{{ $product->slug }}" class="block h-full w-full">
            {{-- Primary Image --}}
            @if(!empty($images))
                <img src="{{ $primaryImage }}" alt="{{ $product->name }}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     onerror="this.onerror=null;this.src='{{ asset('/logo-1.png') }}';"
                     loading="lazy">
            @else
                <div class="w-full h-full flex items-center justify-center text-cream/20">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
            @endif

            {{-- Hover Secondary Image --}}
            @if($secondaryImage)
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <img src="{{ $secondaryImage }}" alt="{{ $product->name }} - Alternate view"
                         class="w-full h-full object-cover"
                         onerror="this.style.display='none';"
                         loading="lazy">
                </div>
            @endif
        </a>

        {{-- Badges --}}
        <div class="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 z-10 pointer-events-none">
            <div class="flex flex-col gap-1.5 pointer-events-auto">
                @if($product->sale_price && $product->sale_price < $product->price)
                    <span class="inline-flex items-center gap-1 bg-red-500/90 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        Sale
                    </span>
                @endif
                @if($product->is_featured)
                    <span class="inline-flex items-center gap-1 bg-gold/90 backdrop-blur text-ink text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        Bestseller
                    </span>
                @endif
            </div>

            {{-- Wishlist Button (Top Right) --}}
            <button @click.stop="$store.wishlist.toggle({
                        id: '{{ $product->public_id ?: $product->id }}',
                        slug: '{{ $product->slug }}',
                        name: '{{ addslashes($product->name) }}',
                        image: '{{ addslashes($primaryImage) }}',
                        price: {{ $product->sale_price ?: $product->price }}
                    })"
                    :class="$store.wishlist.has('{{ $product->public_id ?: $product->id }}') ? 'bg-red-500 text-white' : 'bg-navy/70 text-cream/70 hover:bg-red-500 hover:text-white'"
                    class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur pointer-events-auto shadow-md"
                    title="Toggle Wishlist">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        </div>
    </div>

    {{-- Info Section (Flex Grow to align buttons at bottom) --}}
    <div class="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
            <p class="text-[9px] text-gold/70 uppercase tracking-[0.2em] font-medium mb-1 truncate">{{ $product->category->name ?? 'Collection' }}</p>
            
            <a href="/product/{{ $product->slug }}" class="block mb-2 group/title">
                <h3 class="font-medium text-xs sm:text-sm line-clamp-2 min-h-[2.25rem] text-cream group-hover/title:text-gold transition-colors leading-snug">{{ $product->name }}</h3>
            </a>

            {{-- Color Swatches --}}
            @if($variants->isNotEmpty() && $variants->where('name', 'Color')->count() > 0)
                <div class="mb-2.5 flex items-center gap-1.5">
                    @foreach($variants->where('name', 'Color')->take(4) as $variant)
                        <span class="w-3.5 h-3.5 rounded-full border border-cream/30 inline-block"
                              title="{{ $variant->value }}"
                              style="background-color: {{ $variant->sku ?: '#d4af37' }};"></span>
                    @endforeach
                    @if($variants->where('name', 'Color')->count() > 4)
                        <span class="text-[9px] text-cream/40">+{{ $variants->where('name', 'Color')->count() - 4 }}</span>
                    @endif
                </div>
            @endif
        </div>

        <div>
            {{-- Price --}}
            <div class="mb-3">
                @if($product->sale_price && $product->sale_price < $product->price)
                    <div class="flex items-baseline gap-1.5 flex-wrap">
                        <span class="text-sm sm:text-base font-bold text-gold">Rs. {{ number_format($product->sale_price) }}</span>
                        <span class="text-xs text-cream/40 line-through">Rs. {{ number_format($product->price) }}</span>
                    </div>
                @else
                    <span class="text-sm sm:text-base font-bold text-gold">Rs. {{ number_format($product->price) }}</span>
                @endif
            </div>

            {{-- CTA Buttons aligned at bottom --}}
            <div class="flex gap-2 mt-auto">
                <button @click="$store.cart.add({
                    id: '{{ $product->public_id ?: $product->id }}',
                    productId: {{ $product->id }},
                    slug: '{{ $product->slug }}',
                    name: '{{ addslashes($product->name) }}',
                    image: '{{ addslashes($primaryImage) }}',
                    price: {{ $product->sale_price ?: $product->price }},
                    quantity: 1,
                    variant: ''
                })"
                class="flex-1 py-2 bg-gold text-ink font-bold text-[10px] sm:text-xs rounded-lg hover:bg-gold-light transition-all uppercase tracking-wider text-center">
                    + Add
                </button>
                <button @click="openQuickView()"
                class="flex-1 py-2 border border-gold/30 text-gold hover:bg-gold/10 font-bold text-[10px] sm:text-xs rounded-lg transition-all uppercase tracking-wider text-center">
                    Quick View
                </button>
            </div>
        </div>
    </div>

    {{-- Quick View Modal --}}
    <template x-teleport="body">
        <div x-show="showQuickView" x-cloak
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
               style="z-index:9999;"
             @click.self="closeQuickView()" @keydown.escape.window="closeQuickView()">
            <div x-show="showQuickView"
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95 translate-y-4"
                 x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-100 scale-100"
                 x-transition:leave-end="opacity-0 scale-95"
                  @click.stop
                 class="bg-navy border border-gold/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="flex flex-col md:flex-row">
                    {{-- Image --}}
                    <div class="md:w-1/2 aspect-[3/4] md:aspect-auto bg-navy-soft flex-shrink-0 min-h-[320px]">
                        @if(!empty($images))
                            <div class="relative h-full">
                                <img :src="activeQuickImage" alt="{{ $product->name }}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='{{ asset('/logo-1.png') }}';">
                                @if(count($images) > 1)
                                    <button type="button" @click="prevQuickImage()" class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-gold/20 bg-navy/75 p-2 text-cream transition hover:text-gold hover:bg-navy">
                                        <span class="sr-only">Previous image</span>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                                    </button>
                                    <button type="button" @click="nextQuickImage()" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-gold/20 bg-navy/75 p-2 text-cream transition hover:text-gold hover:bg-navy">
                                        <span class="sr-only">Next image</span>
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                    </button>
                                @endif
                            </div>
                        @else
                            <div class="w-full h-full flex items-center justify-center text-cream/20 min-h-[320px]">
                                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                        @endif
                    </div>
                    {{-- Details --}}
                    <div class="md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <p class="text-[9px] text-gold/70 uppercase tracking-[0.2em] font-medium mb-1">{{ $product->category->name ?? 'Collection' }}</p>
                                <h3 class="text-xl md:text-2xl font-bold text-cream leading-tight">{{ $product->name }}</h3>
                            </div>
                            <button @click="closeQuickView()" class="text-cream/40 hover:text-cream transition ml-2 flex-shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        @if($product->description)
                            <p class="text-sm md:text-base text-cream/50 mb-4 line-clamp-4">{{ $product->description }}</p>
                        @endif
                        @if(count($images) > 1)
                            <div class="mb-5 flex gap-2 overflow-x-auto pb-1">
                                @foreach($images as $idx => $img)
                                    <button type="button" @click="currentQuickImage = null; selectedQuickImage = {{ $idx }}"
                                            :class="selectedQuickImage === {{ $idx }} ? 'border-gold' : 'border-gold/20'"
                                            class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition">
                                        <img src="{{ $img }}" alt="" class="h-full w-full object-cover">
                                    </button>
                                @endforeach
                            </div>
                        @endif
                        <div class="mb-5">
                            @if($product->sale_price && $product->sale_price < $product->price)
                                <div class="flex items-baseline gap-2">
                                    <span class="text-xl md:text-2xl font-bold text-gold">Rs. <span x-text="Number(modalPrice).toLocaleString()"></span></span>
                                    <span class="text-sm text-cream/40 line-through">Rs. {{ number_format($product->price) }}</span>
                                </div>
                            @else
                                <span class="text-xl md:text-2xl font-bold text-gold">Rs. <span x-text="Number(modalPrice).toLocaleString()"></span></span>
                            @endif
                        </div>
                        @if($variants->isNotEmpty())
                            <div class="mb-5">
                                <p class="text-xs text-cream/50 mb-2 uppercase tracking-wider">Available Options</p>
                                <div class="flex flex-wrap gap-1.5">
                                    @foreach($variantOptions as $variantOption)
                                        <button type="button"
                                                @click="selectVariant({{ $variantOption['id'] }})"
                                                :class="selectedVariantId === {{ $variantOption['id'] }} ? 'border-gold bg-gold/10 text-cream' : 'border-gold/15 text-cream/70'"
                                                class="px-2.5 py-1 bg-white/5 border rounded text-xs transition">
                                            {{ $variantOption['label'] !== '' ? $variantOption['label'] : 'Variant' }}
                                            @if($variantOption['price'] != ($product->sale_price ?: $product->price))
                                                - Rs. {{ number_format($variantOption['price']) }}
                                            @endif
                                        </button>
                                    @endforeach
                                </div>
                                <p class="mt-2 text-[11px] text-cream/45" x-show="selectedVariantLabel" x-text="selectedVariantLabel"></p>
                            </div>
                        @endif
                        <div class="mb-5">
                            <p class="text-xs text-cream/50 mb-2 uppercase tracking-wider">Quantity</p>
                            <div class="flex items-center gap-3">
                                <button type="button" @click="qty = Math.max(1, qty - 1)" class="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition text-lg">-</button>
                                <span class="w-10 text-center font-bold" x-text="qty"></span>
                                <button type="button" @click="qty++" class="w-10 h-10 rounded-lg border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition text-lg">+</button>
                            </div>
                        </div>
                        <div class="mt-auto flex flex-col sm:flex-row gap-2">
                            <button @click="$store.cart.add({
                                id: '{{ $product->public_id ?: $product->id }}' + (selectedVariant ? '-' + selectedVariant.id : ''),
                                productId: {{ $product->id }},
                                slug: '{{ $product->slug }}',
                                name: '{{ addslashes($product->name) }}',
                                image: activeQuickImage,
                                price: modalPrice,
                                quantity: qty,
                                variant: selectedVariantLabel
                            }); closeQuickView()"
                            class="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold text-xs rounded-lg uppercase tracking-wider hover:shadow-lg hover:shadow-gold/20 transition text-center">
                                Add to Cart
                            </button>
                            <a href="/product/{{ $product->slug }}"
                               @click="closeQuickView()"
                               class="flex-1 py-3 border border-gold/30 text-gold font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-gold/10 transition text-center">
                                Full Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
</div>
