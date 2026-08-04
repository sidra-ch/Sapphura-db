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

            <form method="POST" action="/sign-up" class="space-y-5" x-data="{ showPassword: false, showConfirmPassword: false }">
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
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" name="password" required
                            class="w-full px-4 pr-12 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                            placeholder="••••••••">
                        <button type="button"
                            @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 px-3 text-cream/60 hover:text-gold transition"
                            :aria-label="showPassword ? 'Hide password' : 'Show password'"
                            :title="showPassword ? 'Hide password' : 'Show password'">
                            <svg x-show="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <svg x-show="showPassword" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:none;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.317-3.593m3.178-2.431A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.043 5.129M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-2.123.879M3 3l18 18"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block text-sm text-cream/70 mb-1.5">Confirm Password</label>
                    <div class="relative">
                        <input :type="showConfirmPassword ? 'text' : 'password'" name="password_confirmation" required
                            class="w-full px-4 pr-12 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition"
                            placeholder="••••••••">
                        <button type="button"
                            @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute inset-y-0 right-0 px-3 text-cream/60 hover:text-gold transition"
                            :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                            :title="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'">
                            <svg x-show="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <svg x-show="showConfirmPassword" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:none;">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.317-3.593m3.178-2.431A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.043 5.129M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-2.123.879M3 3l18 18"/>
                            </svg>
                        </button>
                    </div>
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
