@extends('layouts.app')
@section('title', 'Order Confirmed – Sapphura')

@section('content')
<div class="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
    <div class="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
    </div>
    <h1 class="text-3xl font-bold mb-3">Thank You!</h1>
    <p class="text-cream/60 mb-6">Your order has been placed successfully. We'll send you a confirmation email shortly.</p>
    @if(request('order'))
        <p class="text-sm text-cream/40 mb-6">Order ID: <span class="text-gold font-mono">{{ request('order') }}</span></p>
    @endif
    <div class="flex gap-3 justify-center">
        <a href="/collections" class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Continue Shopping</a>
        <a href="/account" class="px-6 py-3 border border-gold/30 text-gold rounded-lg text-sm tracking-wider uppercase">View Orders</a>
    </div>
</div>
@endsection
