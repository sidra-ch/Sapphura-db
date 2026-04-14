@extends('layouts.app')
@section('title', 'How to Order – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-3">How to Order</h1>
        <p class="text-cream/60">Ordering from Sapphura is quick and easy</p>
    </div>

    <div class="space-y-6">
        @php
        $steps = [
            ['icon' => 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', 'title' => 'Browse & Select', 'desc' => 'Explore our collections and find the perfect products. Use filters to narrow down by category, price, or brand.'],
            ['icon' => 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z', 'title' => 'Add to Cart', 'desc' => 'Click "Add to Cart" on any product. Choose your preferred variant if available. You can adjust quantities in the cart.'],
            ['icon' => 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', 'title' => 'Checkout', 'desc' => 'Fill in your shipping details and choose your payment method: Cash on Delivery, Stripe (credit/debit card), JazzCash, or EasyPaisa.'],
            ['icon' => 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', 'title' => 'Confirmation', 'desc' => 'You\'ll receive an order confirmation via email and SMS. Sit back and relax — your package is on its way!'],
            ['icon' => 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', 'title' => 'Delivery', 'desc' => 'Standard delivery takes 3-5 business days. Express delivery available in major cities for 1-2 day delivery.'],
        ];
        @endphp

        @foreach($steps as $i => $step)
            <div class="glass rounded-xl p-6 flex gap-5">
                <div class="shrink-0">
                    <div class="w-12 h-12 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center">
                        <span class="text-gold font-bold">{{ $i + 1 }}</span>
                    </div>
                </div>
                <div>
                    <h3 class="font-semibold mb-1">{{ $step['title'] }}</h3>
                    <p class="text-cream/60 text-sm leading-relaxed">{{ $step['desc'] }}</p>
                </div>
            </div>
        @endforeach
    </div>

    <div class="text-center mt-12">
        <a href="/collections" class="inline-block px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Start Shopping</a>
    </div>
</div>
@endsection
