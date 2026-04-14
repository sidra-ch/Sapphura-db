@extends('layouts.admin')
@section('title', ($customer->name ?? 'Customer') . ' – Admin')

@section('content')
<div class="flex items-center gap-3 mb-6">
    <a href="/admin/customers" class="text-cream/50 hover:text-gold transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </a>
    <h1 class="text-2xl font-bold">Customer Details</h1>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {{-- Profile Card --}}
    <div class="glass rounded-xl p-6">
        <div class="flex flex-col items-center text-center mb-6">
            <div class="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center text-2xl font-bold text-gold mb-3">
                {{ strtoupper(substr($customer->name ?? 'U', 0, 1)) }}
            </div>
            <h2 class="text-lg font-bold">{{ $customer->name ?? '—' }}</h2>
            <p class="text-cream/50 text-sm">{{ $customer->email }}</p>
        </div>

        <div class="space-y-3 text-sm">
            <div class="flex justify-between">
                <span class="text-cream/50">Phone</span>
                <span>{{ $customer->phone ?? '—' }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-cream/50">Joined</span>
                <span>{{ $customer->created_at->format('d M Y') }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-cream/50">Role</span>
                <span class="px-2 py-0.5 rounded-full text-xs {{ ($customer->role ?? 'user') === 'admin' ? 'bg-gold/20 text-gold' : 'bg-blue-500/20 text-blue-400' }}">
                    {{ ucfirst($customer->role ?? 'user') }}
                </span>
            </div>
        </div>
    </div>

    {{-- Stats --}}
    <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="glass rounded-xl p-5 text-center">
            <div class="text-3xl font-bold text-gold">{{ $customer->orders_count ?? 0 }}</div>
            <div class="text-cream/50 text-sm mt-1">Total Orders</div>
        </div>
        <div class="glass rounded-xl p-5 text-center">
            <div class="text-3xl font-bold text-gold">Rs. {{ number_format($customer->orders_sum_total ?? 0) }}</div>
            <div class="text-cream/50 text-sm mt-1">Total Spent</div>
        </div>
        <div class="glass rounded-xl p-5 text-center">
            @php
                $avgOrder = ($customer->orders_count ?? 0) > 0 ? ($customer->orders_sum_total ?? 0) / $customer->orders_count : 0;
            @endphp
            <div class="text-3xl font-bold text-gold">Rs. {{ number_format($avgOrder) }}</div>
            <div class="text-cream/50 text-sm mt-1">Avg. Order Value</div>
        </div>
    </div>
</div>

{{-- Order History --}}
<div class="mt-6">
    <h2 class="text-lg font-bold mb-4">Order History</h2>
    <div class="glass rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gold/10 text-cream/50 text-left">
                        <th class="p-4 font-medium">Order #</th>
                        <th class="p-4 font-medium">Date</th>
                        <th class="p-4 font-medium">Items</th>
                        <th class="p-4 font-medium">Total</th>
                        <th class="p-4 font-medium">Status</th>
                        <th class="p-4 font-medium">Payment</th>
                        <th class="p-4 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gold/5">
                    @forelse($orders as $order)
                        @php
                            $statusColors = [
                                'pending' => 'bg-yellow-500/20 text-yellow-400',
                                'processing' => 'bg-blue-500/20 text-blue-400',
                                'shipped' => 'bg-purple-500/20 text-purple-400',
                                'delivered' => 'bg-green-500/20 text-green-400',
                                'cancelled' => 'bg-red-500/20 text-red-400',
                            ];
                        @endphp
                        <tr class="hover:bg-white/5 transition">
                            <td class="p-4 font-mono text-gold">#{{ $order->id }}</td>
                            <td class="p-4 text-cream/60">{{ $order->created_at->format('d M Y, h:i A') }}</td>
                            <td class="p-4">
                                @php $items = $order->items ?? []; @endphp
                                {{ count($items) }} item{{ count($items) !== 1 ? 's' : '' }}
                            </td>
                            <td class="p-4 font-semibold">Rs. {{ number_format($order->total ?? 0) }}</td>
                            <td class="p-4">
                                <span class="px-2 py-0.5 rounded-full text-xs {{ $statusColors[$order->status] ?? 'bg-gray-500/20 text-gray-400' }}">
                                    {{ ucfirst($order->status) }}
                                </span>
                            </td>
                            <td class="p-4 text-cream/60">{{ ucfirst(str_replace('_', ' ', $order->payment_method ?? '—')) }}</td>
                            <td class="p-4">
                                <a href="/admin/orders/{{ $order->id }}" class="px-3 py-1 border border-gold/30 text-gold rounded text-xs hover:bg-gold/10 transition">View</a>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="7" class="p-8 text-center text-cream/40">No orders yet</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    @if(method_exists($orders, 'links'))
        <div class="mt-4">{{ $orders->links() }}</div>
    @endif
</div>
@endsection