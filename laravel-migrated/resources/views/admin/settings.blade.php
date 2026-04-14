@extends('layouts.admin')
@section('title', 'Settings – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Settings</h1>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {{-- Store Info --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            Store Information
        </h2>
        <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Store Name</span>
                <span class="font-medium">Sapphura</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Website</span>
                <span class="font-medium text-gold">{{ config('app.url') }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Currency</span>
                <span class="font-medium">PKR (Rs.)</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Country</span>
                <span class="font-medium">Pakistan</span>
            </div>
            <div class="flex justify-between py-2">
                <span class="text-cream/50">Contact Email</span>
                <span class="font-medium">{{ config('mail.from.address', 'N/A') }}</span>
            </div>
        </div>
    </div>

    {{-- Shipping Rates --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8"/></svg>
            Shipping Zones
        </h2>
        <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Karachi</span>
                <span class="font-medium text-gold">Rs. 200</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Lahore, Islamabad</span>
                <span class="font-medium text-gold">Rs. 250</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Other Cities</span>
                <span class="font-medium text-gold">Rs. 300</span>
            </div>
            <div class="flex justify-between py-2">
                <span class="text-cream/50">Free Shipping Over</span>
                <span class="font-medium text-green-400">Rs. 5,000</span>
            </div>
        </div>
        <p class="text-xs text-cream/30 mt-3">To update shipping rates, edit the checkout configuration.</p>
    </div>

    {{-- Payment Methods --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            Payment Methods
        </h2>
        <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between py-2 border-b border-gold/5">
                <span>Cash on Delivery (COD)</span>
                <span class="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Enabled</span>
            </div>
            <div class="flex items-center justify-between py-2 border-b border-gold/5">
                <span>Bank Transfer</span>
                <span class="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Enabled</span>
            </div>
            <div class="flex items-center justify-between py-2">
                <span>JazzCash / Easypaisa</span>
                <span class="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Enabled</span>
            </div>
        </div>
    </div>

    {{-- System Info --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            System Info
        </h2>
        <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Laravel Version</span>
                <span class="font-mono text-xs">{{ app()->version() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">PHP Version</span>
                <span class="font-mono text-xs">{{ phpversion() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gold/5">
                <span class="text-cream/50">Environment</span>
                <span class="font-mono text-xs">{{ config('app.env') }}</span>
            </div>
            <div class="flex justify-between py-2">
                <span class="text-cream/50">Debug Mode</span>
                <span class="px-2 py-0.5 rounded-full text-xs {{ config('app.debug') ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400' }}">
                    {{ config('app.debug') ? 'ON' : 'OFF' }}
                </span>
            </div>
        </div>
    </div>
</div>

{{-- Quick Actions --}}
<div class="mt-6 glass rounded-xl p-6">
    <h2 class="text-lg font-bold mb-4">Quick Actions</h2>
    <div class="flex flex-wrap gap-3">
        <a href="/admin/products/create" class="px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm hover:bg-gold/20 transition">+ Add Product</a>
        <a href="/admin/categories/create" class="px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm hover:bg-gold/20 transition">+ Add Category</a>
        <a href="/admin/coupons/create" class="px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm hover:bg-gold/20 transition">+ Create Coupon</a>
        <a href="/admin/orders" class="px-4 py-2 bg-gold/10 text-gold rounded-lg text-sm hover:bg-gold/20 transition">View Orders</a>
    </div>
</div>
@endsection