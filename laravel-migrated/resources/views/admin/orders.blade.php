@extends('layouts.admin')
@section('title', 'Orders – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Orders</h1>

{{-- Filters --}}
<div class="glass rounded-xl p-4 mb-6">
    <form method="GET" action="/admin/orders" class="flex flex-wrap gap-3 items-end">
        <div class="flex-1 min-w-[200px]">
            <label class="block text-xs text-cream/50 mb-1">Search</label>
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Order ID, name, email, phone, tracking..."
                class="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
        </div>
        <div>
            <label class="block text-xs text-cream/50 mb-1">Status</label>
            <select name="status" class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition [&>option]:text-black [&>option]:bg-white">
                <option value="">All Statuses</option>
                @foreach(['pending','confirmed','processing','shipped','delivered','completed','cancelled'] as $s)
                    <option value="{{ $s }}" {{ request('status') === $s ? 'selected' : '' }}>{{ ucfirst($s) }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <label class="block text-xs text-cream/50 mb-1">Payment</label>
            <select name="payment" class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition [&>option]:text-black [&>option]:bg-white">
                <option value="">All Methods</option>
                @foreach(['cod','stripe','jazzcash','easypaisa'] as $p)
                    <option value="{{ $p }}" {{ request('payment') === $p ? 'selected' : '' }}>{{ strtoupper($p) }}</option>
                @endforeach
            </select>
        </div>
        <div>
            <label class="block text-xs text-cream/50 mb-1">From</label>
            <input type="date" name="date_from" value="{{ request('date_from') }}"
                class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
        </div>
        <div>
            <label class="block text-xs text-cream/50 mb-1">To</label>
            <input type="date" name="date_to" value="{{ request('date_to') }}"
                class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
        </div>
        <div class="flex gap-2">
            <button type="submit" class="px-4 py-2 bg-gold/20 text-gold rounded-lg text-sm font-semibold hover:bg-gold/30 transition">Filter</button>
            <a href="/admin/orders" class="px-4 py-2 border border-gold/20 text-cream/50 rounded-lg text-sm hover:text-gold transition">Clear</a>
        </div>
    </form>
</div>

<div class="glass rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10 text-cream/50 text-left">
                    <th class="p-4 font-medium">Order</th>
                    <th class="p-4 font-medium">Customer</th>
                    <th class="p-4 font-medium">Total</th>
                    <th class="p-4 font-medium">Payment</th>
                    <th class="p-4 font-medium">Status</th>
                    <th class="p-4 font-medium">Tracking</th>
                    <th class="p-4 font-medium">Date</th>
                    <th class="p-4 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($orders as $order)
                    <tr class="hover:bg-white/5 transition">
                        <td class="p-4 font-mono text-gold">#{{ $order->id }}</td>
                        <td class="p-4">
                            <div>
                                <p class="font-medium">{{ $order->shipping_name ?? $order->user->name ?? 'N/A' }}</p>
                                <p class="text-cream/40 text-xs">{{ $order->user->email ?? '—' }}</p>
                            </div>
                        </td>
                        <td class="p-4 font-semibold">Rs. {{ number_format($order->total ?? 0) }}</td>
                        <td class="p-4 text-cream/60 text-xs uppercase">{{ $order->payment_method ?? '—' }}</td>
                        <td class="p-4">
                            <span class="px-2 py-0.5 rounded-full text-xs
                                @if(in_array($order->status, ['delivered','completed'])) bg-green-500/20 text-green-400
                                @elseif($order->status === 'cancelled') bg-red-500/20 text-red-400
                                @elseif($order->status === 'shipped') bg-blue-500/20 text-blue-400
                                @elseif($order->status === 'processing') bg-purple-500/20 text-purple-400
                                @else bg-gold/20 text-gold @endif">
                                {{ ucfirst($order->status ?? 'pending') }}
                            </span>
                        </td>
                        <td class="p-4">
                            @if($order->tracking_number)
                                <span class="text-xs text-blue-400 font-mono">{{ $order->tracking_number }}</span>
                            @else
                                <span class="text-cream/20 text-xs">—</span>
                            @endif
                        </td>
                        <td class="p-4 text-cream/50">{{ $order->created_at->format('d M Y') }}</td>
                        <td class="p-4">
                            <a href="/admin/orders/{{ $order->id }}" class="px-3 py-1 border border-gold/30 text-gold rounded text-xs hover:bg-gold/10 transition">View</a>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="8" class="p-8 text-center text-cream/40">No orders found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@if(method_exists($orders, 'links'))
    <div class="mt-6">{{ $orders->links() }}</div>
@endif
@endsection
