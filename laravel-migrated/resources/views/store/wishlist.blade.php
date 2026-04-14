@extends('layouts.app')
@section('title', 'Wishlist – Sapphura')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 py-10" x-data>
    <h1 class="text-3xl font-bold text-center mb-10">Wishlist</h1>

    <template x-if="$store.wishlist.items.length === 0">
        <div class="text-center py-20">
            <svg class="w-20 h-20 text-cream/15 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <p class="text-cream/50 text-lg mb-4">Your wishlist is empty</p>
            <a href="/collections" class="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Start Shopping</a>
        </div>
    </template>

    <template x-if="$store.wishlist.items.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <template x-for="item in $store.wishlist.items" :key="item.id">
                <div class="glass rounded-xl overflow-hidden">
                    <a :href="'/product/' + item.slug" class="block aspect-square bg-navy-soft overflow-hidden">
                        <img :src="item.image" :alt="item.name" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                    </a>
                    <div class="p-4">
                        <a :href="'/product/' + item.slug"><h3 class="font-semibold text-sm line-clamp-2 hover:text-gold transition" x-text="item.name"></h3></a>
                        <p class="text-gold font-bold mt-2">Rs. <span x-text="item.price.toLocaleString()"></span></p>
                        <div class="flex gap-2 mt-3">
                            <button @click="$store.cart.add({...item, quantity: 1, variant: ''})"
                                    class="flex-1 py-2 bg-gradient-to-r from-gold to-gold-light text-ink font-bold text-xs rounded-lg tracking-wider uppercase">Add to Cart</button>
                            <button @click="$store.wishlist.remove(item.id)" class="w-10 h-10 border border-red-400/30 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>
</div>
@endsection
