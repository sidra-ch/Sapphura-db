@extends('layouts.app')
@section('title', 'Cart – Sapphura')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 py-10" x-data>
    <h1 class="text-3xl font-bold text-center mb-10">Shopping Cart</h1>

    <template x-if="$store.cart.items.length === 0">
        <div class="text-center py-20">
            <svg class="w-20 h-20 text-cream/15 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <p class="text-cream/50 text-lg mb-4">Your cart is empty</p>
            <a href="/collections" class="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Continue Shopping</a>
        </div>
    </template>

    <template x-if="$store.cart.items.length > 0">
        <div class="space-y-4">
            <template x-for="item in $store.cart.items" :key="item.id">
                <div class="glass rounded-xl p-4 flex gap-4 items-center">
                    <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-lg flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold truncate" x-text="item.name"></h3>
                        <p class="text-xs text-cream/50 mt-0.5" x-show="item.variant" x-text="item.variant"></p>
                        <p class="text-gold font-bold mt-1">Rs. <span x-text="item.price.toLocaleString()"></span></p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="$store.cart.updateQty(item.id, item.quantity - 1)" class="w-8 h-8 rounded border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition">−</button>
                        <span class="w-8 text-center text-sm" x-text="item.quantity"></span>
                        <button @click="$store.cart.updateQty(item.id, item.quantity + 1)" class="w-8 h-8 rounded border border-gold/30 flex items-center justify-center hover:bg-gold/10 transition">+</button>
                    </div>
                    <p class="text-gold font-bold w-24 text-right">Rs. <span x-text="(item.price * item.quantity).toLocaleString()"></span></p>
                    <button @click="$store.cart.remove(item.id)" class="text-cream/40 hover:text-red-400 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </template>

            {{-- Summary --}}
            <div class="glass rounded-xl p-6 mt-6">
                <div class="flex justify-between text-lg mb-4">
                    <span>Subtotal</span>
                    <span class="text-gold font-bold">Rs. <span x-text="$store.cart.totalPrice.toLocaleString()"></span></span>
                </div>
                <p class="text-xs text-cream/40 mb-4">Shipping calculated at checkout</p>
                <div class="flex gap-3">
                    <a href="/checkout" class="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold text-center rounded-lg hover:shadow-lg hover:shadow-gold/20 transition text-sm tracking-wider uppercase">Proceed to Checkout</a>
                    <a href="/collections" class="px-6 py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition text-sm tracking-wider uppercase text-center">Continue Shopping</a>
                </div>
            </div>
        </div>
    </template>
</div>
@endsection
