@extends('layouts.app')
@section('title', 'Track Your Order – Sapphura')

@section('content')
<div class="max-w-lg mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-10">
        <h1 class="text-4xl font-bold mb-3">Track Your Order</h1>
        <p class="text-cream/60">Enter your order ID to check its status</p>
    </div>

    <div class="glass rounded-2xl p-8" x-data="{ orderId: '', result: null, loading: false, error: '' }">
        <form @submit.prevent="
            loading = true; error = ''; result = null;
            fetch('/api/orders/' + orderId)
                .then(r => r.ok ? r.json() : Promise.reject('Order not found'))
                .then(d => { result = d; loading = false; })
                .catch(e => { error = typeof e === 'string' ? e : 'Order not found. Please check your order ID.'; loading = false; })
        " class="space-y-4">
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Order ID</label>
                <input type="text" x-model="orderId" required placeholder="e.g. 12345"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
            <button type="submit" :disabled="loading"
                class="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg tracking-wider uppercase text-sm disabled:opacity-50">
                <span x-show="!loading">Track Order</span>
                <span x-show="loading">Searching...</span>
            </button>
        </form>

        {{-- Error --}}
        <template x-if="error">
            <div class="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-300" x-text="error"></div>
        </template>

        {{-- Result --}}
        <template x-if="result">
            <div class="mt-6 space-y-4">
                <div class="border-t border-gold/10 pt-6">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-sm text-cream/50">Order Status</span>
                        <span class="px-3 py-1 rounded-full text-sm font-medium bg-gold/20 text-gold" x-text="result.status?.charAt(0).toUpperCase() + result.status?.slice(1)"></span>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between text-cream/60">
                            <span>Total</span>
                            <span x-text="'Rs. ' + Number(result.total_amount || result.total || 0).toLocaleString()"></span>
                        </div>
                        <div class="flex justify-between text-cream/60">
                            <span>Payment</span>
                            <span x-text="(result.payment_method || 'N/A').toUpperCase()"></span>
                        </div>
                        <div class="flex justify-between text-cream/60">
                            <span>Date</span>
                            <span x-text="new Date(result.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })"></span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</div>
@endsection
