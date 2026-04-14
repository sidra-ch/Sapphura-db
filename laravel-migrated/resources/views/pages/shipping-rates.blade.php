@extends('layouts.app')
@section('title', 'Shipping Rates – Sapphura')

@section('content')
<div class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-3">Shipping Rates</h1>
        <p class="text-cream/60">Fast & reliable delivery across Pakistan</p>
    </div>

    <div class="space-y-6">
        {{-- Standard --}}
        <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold">Standard Delivery</h3>
                <span class="text-gold font-bold text-lg">Rs. 200</span>
            </div>
            <ul class="text-cream/60 text-sm space-y-1.5">
                <li>• 3–5 business days</li>
                <li>• Available nationwide</li>
                <li>• Tracking included</li>
            </ul>
        </div>

        {{-- Express --}}
        <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold">Express Delivery</h3>
                <span class="text-gold font-bold text-lg">Rs. 500</span>
            </div>
            <ul class="text-cream/60 text-sm space-y-1.5">
                <li>• 1–2 business days</li>
                <li>• Available in major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad)</li>
                <li>• Priority handling & tracking</li>
            </ul>
        </div>

        {{-- Free Shipping --}}
        <div class="glass rounded-xl p-6 border border-gold/30">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-semibold text-gold">Free Shipping</h3>
                <span class="text-gold font-bold text-lg">Rs. 0</span>
            </div>
            <ul class="text-cream/60 text-sm space-y-1.5">
                <li>• Orders above Rs. 5,000</li>
                <li>• Standard delivery timeline applies</li>
                <li>• Automatic at checkout</li>
            </ul>
        </div>
    </div>

    <div class="glass rounded-xl p-6 mt-8">
        <h3 class="font-semibold mb-3">Important Notes</h3>
        <ul class="text-cream/60 text-sm space-y-1.5">
            <li>• Delivery times are estimated and may vary during peak seasons or holidays.</li>
            <li>• Orders placed before 2:00 PM are processed the same business day.</li>
            <li>• Remote areas may take 1-2 additional business days.</li>
            <li>• You will receive a tracking number via email/SMS once your order ships.</li>
        </ul>
    </div>
</div>
@endsection
