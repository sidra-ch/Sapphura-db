@extends('layouts.app')
@section('title', 'Reset Password – Sapphura')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md">
        <div class="glass rounded-2xl p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-2">Reset Password</h1>
                <p class="text-cream/60 text-sm">Enter your new password below</p>
            </div>

            @if($errors->any())
                <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-sm text-red-300">
                    @foreach($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="/reset-password" class="space-y-5">
                @csrf
                <input type="hidden" name="token" value="{{ $token }}">
                <input type="hidden" name="email" value="{{ $email }}">
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Email</label>
                    <input type="email" value="{{ $email }}" disabled
                        class="w-full px-4 py-3 bg-white/5 border border-gold/10 rounded-lg text-cream/50 cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">New Password</label>
                    <input type="password" name="password" required
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                        placeholder="••••••••">
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Confirm Password</label>
                    <input type="password" name="password_confirmation" required
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                        placeholder="••••••••">
                </div>
                <button type="submit"
                    class="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-gold/20 transition">
                    Reset Password
                </button>
            </form>
        </div>
    </div>
</div>
@endsection
