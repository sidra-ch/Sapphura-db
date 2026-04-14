{{-- Cart Drawer (slide from right) --}}
<div x-data x-show="$store.cart.open" x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
     x-transition:leave="transition ease-in duration-200"
     x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
     class="fixed inset-0 z-[60]" style="display:none;">
    {{-- Overlay --}}
    <div @click="$store.cart.open = false" class="absolute inset-0 bg-black/60"></div>

    {{-- Panel --}}
    <div x-show="$store.cart.open"
         x-transition:enter="transition ease-out duration-300 transform"
         x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0"
         x-transition:leave="transition ease-in duration-200 transform"
         x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full"
         class="absolute right-0 top-0 h-full w-full max-w-md bg-ink border-l border-gold/10 flex flex-col">

        {{-- Header --}}
        <div class="flex items-center justify-between p-5 border-b border-gold/10">
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                <span class="text-lg font-bold tracking-wider">Your Cart</span>
            </div>
            <button @click="$store.cart.open = false" class="text-cream/60 hover:text-gold transition">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>

        {{-- Items --}}
        <div class="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
            <template x-if="$store.cart.items.length === 0">
                <div class="flex flex-col items-center justify-center h-full text-center">
                    <svg class="w-16 h-16 text-cream/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <p class="text-cream/50 mb-4">Your cart is empty</p>
                    <a href="/collections" @click="$store.cart.open = false" class="text-gold hover:underline text-sm">Continue Shopping</a>
                </div>
            </template>

            <template x-for="item in $store.cart.items" :key="item.id">
                <div class="flex gap-4 glass rounded-lg p-3">
                    <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold truncate" x-text="item.name"></h4>
                        <p class="text-xs text-cream/50 mt-0.5" x-show="item.variant" x-text="item.variant"></p>
                        <p class="text-gold text-sm mt-1">Rs. <span x-text="item.price.toLocaleString()"></span></p>
                        <div class="flex items-center gap-2 mt-2">
                            <button @click="$store.cart.updateQty(item.id, item.quantity - 1)" class="w-6 h-6 rounded border border-gold/30 flex items-center justify-center text-xs hover:bg-gold/20 transition">−</button>
                            <span class="text-sm w-6 text-center" x-text="item.quantity"></span>
                            <button @click="$store.cart.updateQty(item.id, item.quantity + 1)" class="w-6 h-6 rounded border border-gold/30 flex items-center justify-center text-xs hover:bg-gold/20 transition">+</button>
                            <button @click="$store.cart.remove(item.id)" class="ml-auto text-cream/40 hover:text-red-400 transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        {{-- Footer --}}
        <div x-show="$store.cart.items.length > 0" class="p-5 border-t border-gold/10 space-y-3">
            <div class="flex justify-between text-sm">
                <span class="text-cream/60">Subtotal</span>
                <span class="text-gold font-bold">Rs. <span x-text="$store.cart.totalPrice.toLocaleString()"></span></span>
            </div>
            <a href="/checkout" @click="$store.cart.open = false"
               class="block w-full py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold text-center rounded-lg hover:shadow-lg hover:shadow-gold/20 transition text-sm tracking-wider uppercase">
                Proceed to Checkout
            </a>
            <a href="/cart" @click="$store.cart.open = false" class="block text-center text-sm text-cream/50 hover:text-gold transition">
                View Full Cart
            </a>
        </div>
    </div>
</div>
