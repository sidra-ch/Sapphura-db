@extends('layouts.app')
@section('title', 'Session Expired – Sapphura')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div class="text-center max-w-md">
        <div class="mb-8">
            <span class="text-[120px] font-bold leading-none text-gold/20" style="font-family:Georgia,serif;">419</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family:Georgia,serif;">Session Expired</h1>
        <p class="text-cream/50 mb-8">Your session has expired due to inactivity. Please try again.</p>
        <a href="/" class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition">
            Back to Home
        </a>
    </div>
</div>
@endsection
