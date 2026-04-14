@extends('layouts.app')
@section('title', 'Exchange Policy – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <h1 class="text-4xl font-bold mb-8">Exchange Policy</h1>

    <div class="space-y-6 text-cream/70 text-sm leading-relaxed">
        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Exchange Window</h2>
            <p>We accept exchanges within <strong class="text-cream">7 days</strong> of delivery. The product must be unused, unopened, and in its original packaging.</p>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">What Can Be Exchanged</h2>
            <ul class="space-y-1.5">
                <li>• Wrong product received</li>
                <li>• Wrong variant (size, shade, etc.)</li>
                <li>• Defective or damaged items</li>
                <li>• Product did not match description</li>
            </ul>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">How to Exchange</h2>
            <ol class="space-y-1.5 list-decimal list-inside">
                <li>Contact us at <span class="text-gold">sapphura@gmail.com</span> or via WhatsApp.</li>
                <li>Provide your order ID, product details, and reason for exchange.</li>
                <li>We'll arrange pickup of the original product.</li>
                <li>The replacement will be shipped within <strong class="text-cream">3-5 business days</strong> after receiving the returned item.</li>
            </ol>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Exchange Shipping</h2>
            <ul class="space-y-1.5">
                <li>• If the exchange is due to our error (wrong/defective product): <strong class="text-cream">Free shipping</strong></li>
                <li>• If the exchange is a change of preference: Customer bears return shipping</li>
            </ul>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Non-Exchangeable Items</h2>
            <ul class="space-y-1.5">
                <li>• Opened or used products (unless defective)</li>
                <li>• Items without original packaging</li>
                <li>• Sale/clearance products</li>
            </ul>
        </section>

        <div class="text-center pt-4">
            <p class="text-cream/50 mb-3">Need to make an exchange?</p>
            <a href="/contact" class="inline-block px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Contact Us</a>
        </div>

        <p class="text-cream/40 text-xs">Last updated: {{ now()->format('F Y') }}</p>
    </div>
</div>
@endsection
