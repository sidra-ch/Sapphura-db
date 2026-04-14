@extends('layouts.app')
@section('title', 'Terms of Service – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <h1 class="text-4xl font-bold mb-8">Terms of Service</h1>

    <div class="prose-custom space-y-6 text-cream/70 text-sm leading-relaxed">
        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using the Sapphura website (sapphura.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">2. Products & Pricing</h2>
            <p>All products listed on our website are subject to availability. Prices are listed in Pakistani Rupees (PKR) and may change without prior notice. We reserve the right to limit quantities on any order.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">3. Orders & Payment</h2>
            <p>By placing an order, you are making an offer to purchase. We reserve the right to accept or decline any order. Payment must be completed at the time of purchase (for online payments) or at the time of delivery (for COD orders).</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">4. Shipping & Delivery</h2>
            <p>We aim to deliver within the estimated timeframes. However, delivery times are not guaranteed and may be affected by factors beyond our control. See our <a href="/shipping-rates" class="text-gold hover:underline">Shipping Rates</a> page for details.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">5. Returns & Refunds</h2>
            <p>Please refer to our <a href="/refund-policy" class="text-gold hover:underline">Refund Policy</a> and <a href="/exchange-policy" class="text-gold hover:underline">Exchange Policy</a> pages for detailed information.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">6. Intellectual Property</h2>
            <p>All content on this website, including text, images, logos, and design elements, is the property of Sapphura and is protected by copyright laws. Unauthorized use is prohibited.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">7. Privacy</h2>
            <p>We value your privacy. Any personal information collected is used solely for order processing and communication. We do not share your data with third parties for marketing purposes.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">8. Limitation of Liability</h2>
            <p>Sapphura shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        </section>

        <section>
            <h2 class="text-lg font-semibold text-cream mb-2">9. Contact</h2>
            <p>For any questions regarding these terms, please <a href="/contact" class="text-gold hover:underline">contact us</a>.</p>
        </section>

        <p class="text-cream/40 text-xs pt-4 border-t border-gold/10">Last updated: {{ now()->format('F Y') }}</p>
    </div>
</div>
@endsection
