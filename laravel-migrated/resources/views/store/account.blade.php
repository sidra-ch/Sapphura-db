@extends('layouts.app')
@section('title', 'My Account – Sapphura')

@section('content')
<div class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
    <h1 class="text-3xl font-bold mb-8">My Account</h1>

    <div class="grid lg:grid-cols-3 gap-8">
        {{-- Profile Card --}}
        <div class="glass rounded-2xl p-6">
            <div class="text-center mb-6">
                <div class="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span class="text-2xl font-bold text-gold">{{ strtoupper(substr($user->first_name ?? $user->name ?? 'U', 0, 1)) }}</span>
                </div>
                <h2 class="text-lg font-semibold">{{ $user->first_name ?? '' }} {{ $user->last_name ?? '' }}</h2>
                <p class="text-cream/50 text-sm">{{ $user->email }}</p>
                @if($user->phone)
                    <p class="text-cream/50 text-sm mt-1">{{ $user->phone }}</p>
                @endif
            </div>
            <div class="border-t border-gold/10 pt-4 space-y-2 text-sm">
                <div class="flex justify-between text-cream/60">
                    <span>Member since</span>
                    <span>{{ $user->created_at->format('M Y') }}</span>
                </div>
                <div class="flex justify-between text-cream/60">
                    <span>Total orders</span>
                    <span class="text-gold font-semibold">{{ $orders->count() }}</span>
                </div>
            </div>
            <form method="POST" action="/logout" class="mt-6">
                @csrf
                <button class="w-full py-2.5 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition">
                    Sign Out
                </button>
            </form>
        </div>

        {{-- Orders --}}
        <div class="lg:col-span-2">
            <h2 class="text-xl font-semibold mb-4">Order History</h2>
            @if($orders->count())
                <div class="space-y-4">
                    @foreach($orders as $order)
                        <div class="glass rounded-xl p-5">
                            <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
                                <div>
                                    <span class="text-xs text-cream/40">Order</span>
                                    <p class="font-mono text-sm text-gold">#{{ $order->id }}</p>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs text-cream/40">{{ $order->created_at->format('d M Y') }}</span>
                                    <p class="text-sm font-semibold">Rs. {{ number_format($order->total_amount ?? $order->total ?? 0) }}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="inline-block px-3 py-1 rounded-full text-xs font-medium
                                    @if(in_array($order->status, ['delivered', 'completed'])) bg-green-500/20 text-green-400
                                    @elseif($order->status === 'cancelled') bg-red-500/20 text-red-400
                                    @elseif($order->status === 'shipped') bg-blue-500/20 text-blue-400
                                    @else bg-gold/20 text-gold @endif">
                                    {{ ucfirst($order->status ?? 'pending') }}
                                </span>
                                <span class="text-xs text-cream/40">{{ $order->payment_method ?? 'N/A' }}</span>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <div class="glass rounded-xl p-10 text-center">
                    <svg class="w-12 h-12 text-cream/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    <p class="text-cream/50">No orders yet</p>
                    <a href="/collections" class="inline-block mt-4 text-gold text-sm hover:underline">Start Shopping →</a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
