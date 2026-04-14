@extends('layouts.app')
@section('title', 'Refund Policy – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <h1 class="text-4xl font-bold mb-8">Refund Policy</h1>

    <div class="space-y-6 text-cream/70 text-sm leading-relaxed">
        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Eligibility</h2>
            <ul class="space-y-1.5">
                <li>• Refund requests must be made within <strong class="text-cream">7 days</strong> of delivery.</li>
                <li>• Product must be unused, unopened, and in its original packaging.</li>
                <li>• Proof of purchase (order ID or receipt) is required.</li>
            </ul>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Non-Refundable Items</h2>
            <ul class="space-y-1.5">
                <li>• Products that have been opened, used, or damaged by the customer.</li>
                <li>• Sale or clearance items (unless defective).</li>
                <li>• Gift cards and promotional items.</li>
            </ul>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">How to Request a Refund</h2>
            <ol class="space-y-1.5 list-decimal list-inside">
                <li>Contact us at <span class="text-gold">sapphura@gmail.com</span> or via WhatsApp.</li>
                <li>Provide your order ID and reason for the refund.</li>
                <li>Ship the product back to us (we may arrange pickup for eligible orders).</li>
                <li>Refund will be processed within <strong class="text-cream">5-7 business days</strong> after we receive and inspect the item.</li>
            </ol>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Refund Method</h2>
            <p>Refunds are issued to the original payment method. For COD orders, refunds are processed via bank transfer or EasyPaisa/JazzCash.</p>
        </section>

        <section class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold text-cream mb-2">Damaged or Defective Products</h2>
            <p>If you receive a damaged or defective product, contact us within <strong class="text-cream">48 hours</strong> of delivery with photos. We'll arrange a replacement or full refund at no extra cost.</p>
        </section>

        <p class="text-cream/40 text-xs pt-4">Last updated: {{ now()->format('F Y') }}</p>
    </div>
</div>
@endsection
