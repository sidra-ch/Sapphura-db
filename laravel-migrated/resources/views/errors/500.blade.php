@extends('layouts.app')
@section('title', 'Server Error – Sapphura')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div class="text-center max-w-md">
        <div class="mb-8">
            <span class="text-[120px] font-bold leading-none text-gold/20" style="font-family:Georgia,serif;">500</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family:Georgia,serif;">Something Went Wrong</h1>
        <p class="text-cream/50 mb-8">We're experiencing technical difficulties. Please try again later.</p>
        <a href="/" class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition">
            Back to Home
        </a>
    </div>
</div>
@endsection
