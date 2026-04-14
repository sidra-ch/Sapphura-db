@extends('layouts.app')
@section('title', 'Create Account – Sapphura')

@section('content')
<div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md">
        <div class="glass rounded-2xl p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold mb-2">Create Account</h1>
                <p class="text-cream/60 text-sm">Join the Sapphura family</p>
            </div>

            @if($errors->any())
                <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-sm text-red-300">
                    @foreach($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="/sign-up" class="space-y-5">
                @csrf
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-cream/70 mb-1.5">First Name</label>
                        <input type="text" name="first_name" value="{{ old('first_name') }}" required
                            class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                            placeholder="First">
                    </div>
                    <div>
                        <label class="block text-sm text-cream/70 mb-1.5">Last Name</label>
                        <input type="text" name="last_name" value="{{ old('last_name') }}" required
                            class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                            placeholder="Last">
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" required
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                        placeholder="your@email.com">
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Phone</label>
                    <input type="tel" name="phone" value="{{ old('phone') }}"
                        class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                        placeholder="+92 300 1234567">
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Password</label>
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
                    Create Account
                </button>
            </form>

            <p class="text-center text-sm text-cream/50 mt-6">
                Already have an account?
                <a href="/sign-in" class="text-gold hover:underline">Sign in</a>
            </p>
        </div>
    </div>
</div>
@endsection
