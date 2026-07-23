@extends('layouts.app')
@section('title', 'Page Not Found – Sapphura')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div class="text-center max-w-md">
        <div class="mb-8">
            <span class="text-[120px] font-bold leading-none text-gold/20" style="font-family:Georgia,serif;">404</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family:Georgia,serif;">Page Not Found</h1>
        <p class="text-cream/50 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition">
                Back to Home
            </a>
            <a href="/collections" class="px-6 py-3 border border-gold/30 text-gold rounded-lg text-sm tracking-wider uppercase hover:bg-gold/10 transition">
                Browse Collections
            </a>
        </div>
    </div>
</div>
@endsection
