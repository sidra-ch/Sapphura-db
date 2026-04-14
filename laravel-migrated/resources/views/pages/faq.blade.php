@extends('layouts.app')
@section('title', 'FAQ – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p class="text-cream/60">Quick answers to common questions</p>
    </div>

    <div class="space-y-4" x-data="{ open: null }">
        @php
        $faqs = [
            ['q' => 'Are all products genuine?', 'a' => 'Yes, 100%. We source all our products from authorized distributors and official brand partners. Every product comes with authenticity guaranteed.'],
            ['q' => 'How long does delivery take?', 'a' => 'Standard delivery takes 3-5 business days across Pakistan. Express delivery (available in major cities) takes 1-2 business days.'],
            ['q' => 'What payment methods do you accept?', 'a' => 'We accept Cash on Delivery (COD), credit/debit cards via Stripe, JazzCash, and EasyPaisa.'],
            ['q' => 'Can I return or exchange a product?', 'a' => 'Yes, we offer a hassle-free return/exchange policy. Please check our Exchange Policy and Refund Policy pages for full details.'],
            ['q' => 'Do you deliver all over Pakistan?', 'a' => 'Yes, we deliver nationwide across Pakistan. Shipping charges may vary based on your location.'],
            ['q' => 'How can I track my order?', 'a' => 'Once your order is shipped, you\'ll receive a tracking number via email/SMS. You can also track your order on our Track Order page.'],
            ['q' => 'Do you offer gift wrapping?', 'a' => 'Yes! During checkout, you can add a gift wrapping option with a personalized message.'],
            ['q' => 'What if I receive a damaged product?', 'a' => 'Contact us immediately at sapphura@gmail.com with photos. We\'ll arrange a replacement or full refund.'],
        ];
        @endphp

        @foreach($faqs as $i => $faq)
            <div class="glass rounded-xl overflow-hidden">
                <button @click="open = open === {{ $i }} ? null : {{ $i }}"
                    class="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition">
                    <span class="font-medium pr-4">{{ $faq['q'] }}</span>
                    <svg class="w-5 h-5 text-gold shrink-0 transition-transform" :class="open === {{ $i }} && 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div x-show="open === {{ $i }}" x-collapse class="px-5 pb-5">
                    <p class="text-cream/60 text-sm leading-relaxed">{{ $faq['a'] }}</p>
                </div>
            </div>
        @endforeach
    </div>

    <div class="text-center mt-12 glass rounded-xl p-8">
        <p class="text-cream/60 mb-4">Still have questions?</p>
        <a href="/contact" class="inline-block px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">Contact Us</a>
    </div>
</div>
@endsection
