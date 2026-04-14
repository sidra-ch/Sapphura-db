@extends('layouts.admin')
@section('title', 'Dashboard – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Dashboard</h1>

{{-- Stats Grid --}}
<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div class="glass rounded-xl p-5">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Total Revenue</p>
        <p class="text-2xl font-bold text-gold">Rs. {{ number_format($stats['revenue'] ?? 0) }}</p>
    </div>
    <div class="glass rounded-xl p-5">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Today's Revenue</p>
        <p class="text-2xl font-bold text-green-400">Rs. {{ number_format($stats['todayRevenue'] ?? 0) }}</p>
    </div>
    <div class="glass rounded-xl p-5">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Total Orders</p>
        <p class="text-2xl font-bold">{{ $stats['orders'] ?? 0 }}</p>
        <p class="text-xs text-cream/40 mt-1">Today: {{ $stats['todayOrders'] ?? 0 }}</p>
    </div>
    <div class="glass rounded-xl p-5">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Customers</p>
        <p class="text-2xl font-bold">{{ $stats['customers'] ?? 0 }}</p>
    </div>
</div>

{{-- Second Row Stats --}}
<div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <div class="glass rounded-xl p-4">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Pending</p>
        <p class="text-xl font-bold text-gold">{{ $stats['pending'] ?? 0 }}</p>
    </div>
    <div class="glass rounded-xl p-4">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Processing</p>
        <p class="text-xl font-bold text-purple-400">{{ $stats['processing'] ?? 0 }}</p>
    </div>
    <div class="glass rounded-xl p-4">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Shipped</p>
        <p class="text-xl font-bold text-blue-400">{{ $stats['shipped'] ?? 0 }}</p>
    </div>
    <div class="glass rounded-xl p-4">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Products</p>
        <p class="text-xl font-bold">{{ $stats['products'] ?? 0 }}</p>
    </div>
    <div class="glass rounded-xl p-4">
        <p class="text-cream/50 text-xs uppercase tracking-wider mb-1">Low Stock</p>
        <p class="text-xl font-bold {{ ($stats['lowStock'] ?? 0) > 0 ? 'text-red-400' : '' }}">{{ $stats['lowStock'] ?? 0 }}</p>
    </div>
</div>

<div class="grid lg:grid-cols-3 gap-6 mb-8">
    {{-- Revenue Chart --}}
    <div class="lg:col-span-2 glass rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4">Revenue (Last 7 Days)</h2>
        <div class="h-48 flex items-end gap-2" id="revenueChart">
            @php $maxRev = max(array_column($revenueChart ?? [], 'revenue') ?: [1]); @endphp
            @foreach($revenueChart ?? [] as $day)
                <div class="flex-1 flex flex-col items-center gap-1">
                    <span class="text-xs text-cream/50">Rs. {{ number_format($day['revenue']) }}</span>
                    <div class="w-full bg-gradient-to-t from-gold to-gold-light rounded-t-lg transition-all"
                         style="height: {{ $maxRev > 0 ? max(($day['revenue'] / $maxRev) * 150, 4) : 4 }}px"></div>
                    <span class="text-xs text-cream/40">{{ $day['date'] }}</span>
                    <span class="text-xs text-cream/30">{{ $day['orders'] }} orders</span>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Order Status Distribution --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4">Order Status</h2>
        <div class="space-y-3">
            @php
                $statusColors = ['pending' => 'bg-gold', 'confirmed' => 'bg-yellow-500', 'processing' => 'bg-purple-500', 'shipped' => 'bg-blue-500', 'delivered' => 'bg-green-500', 'completed' => 'bg-green-600', 'cancelled' => 'bg-red-500'];
                $totalOrders = array_sum($statusDistribution ?? []) ?: 1;
            @endphp
            @foreach($statusDistribution ?? [] as $status => $count)
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span class="capitalize">{{ $status }}</span>
                        <span class="text-cream/50">{{ $count }}</span>
                    </div>
                    <div class="w-full bg-white/5 rounded-full h-2">
                        <div class="{{ $statusColors[$status] ?? 'bg-gold' }} rounded-full h-2 transition-all" style="width: {{ ($count / $totalOrders) * 100 }}%"></div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<div class="grid lg:grid-cols-2 gap-6 mb-8">
    {{-- Top Selling Products --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4">Top Selling Products</h2>
        <div class="space-y-3">
            @forelse($topProducts ?? [] as $idx => $tp)
                <div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <span class="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center font-bold">{{ $idx + 1 }}</span>
                    @php $tpImg = is_string($tp->images) ? json_decode($tp->images, true) : ($tp->images ?? []); @endphp
                    @if(!empty($tpImg))
                        <img src="{{ $tpImg[0] }}" class="w-10 h-10 object-cover rounded-lg" alt="">
                    @endif
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{{ $tp->name }}</p>
                        <p class="text-xs text-cream/40">{{ $tp->total_sold }} sold</p>
                    </div>
                    <span class="text-gold text-sm font-semibold">Rs. {{ number_format($tp->total_revenue) }}</span>
                </div>
            @empty
                <p class="text-cream/40 text-sm">No sales data yet</p>
            @endforelse
        </div>
    </div>

    {{-- Low Stock Alerts --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
            Low Stock Alerts
            @if(($stats['lowStock'] ?? 0) > 0)
                <span class="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">{{ $stats['lowStock'] }}</span>
            @endif
        </h2>
        <div class="space-y-3">
            @forelse($lowStockProducts ?? [] as $lsp)
                <div class="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    @php $lspImg = is_string($lsp->images) ? json_decode($lsp->images, true) : ($lsp->images ?? []); @endphp
                    @if(!empty($lspImg))
                        <img src="{{ $lspImg[0] }}" class="w-10 h-10 object-cover rounded-lg" alt="">
                    @endif
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{{ $lsp->name }}</p>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-xs {{ $lsp->stock == 0 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400' }}">
                        {{ $lsp->stock == 0 ? 'Out of Stock' : $lsp->stock . ' left' }}
                    </span>
                    <a href="/admin/products/{{ $lsp->id }}/edit" class="text-gold text-xs hover:underline">Edit</a>
                </div>
            @empty
                <p class="text-green-400 text-sm">All products are well stocked!</p>
            @endforelse
        </div>
    </div>
</div>

{{-- Recent Orders --}}
<div class="glass rounded-xl p-6">
    <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Recent Orders</h2>
        <a href="/admin/orders" class="text-gold text-sm hover:underline">View All →</a>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10 text-cream/50 text-left">
                    <th class="pb-3 font-medium">Order ID</th>
                    <th class="pb-3 font-medium">Customer</th>
                    <th class="pb-3 font-medium">Total</th>
                    <th class="pb-3 font-medium">Payment</th>
                    <th class="pb-3 font-medium">Status</th>
                    <th class="pb-3 font-medium">Date</th>
                    <th class="pb-3 font-medium">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($recentOrders ?? [] as $order)
                    <tr class="hover:bg-white/5 transition">
                        <td class="py-3 font-mono text-gold">#{{ $order->id }}</td>
                        <td class="py-3">{{ $order->shipping_name ?? $order->user->name ?? 'N/A' }}</td>
                        <td class="py-3 font-semibold">Rs. {{ number_format($order->total ?? 0) }}</td>
                        <td class="py-3 text-cream/60 text-xs uppercase">{{ $order->payment_method ?? '—' }}</td>
                        <td class="py-3">
                            <span class="px-2 py-0.5 rounded-full text-xs
                                @if(in_array($order->status, ['delivered','completed'])) bg-green-500/20 text-green-400
                                @elseif($order->status === 'cancelled') bg-red-500/20 text-red-400
                                @elseif($order->status === 'shipped') bg-blue-500/20 text-blue-400
                                @else bg-gold/20 text-gold @endif">
                                {{ ucfirst($order->status ?? 'pending') }}
                            </span>
                        </td>
                        <td class="py-3 text-cream/50">{{ $order->created_at->format('d M Y') }}</td>
                        <td class="py-3">
                            <a href="/admin/orders/{{ $order->id }}" class="text-gold text-xs hover:underline">View →</a>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="7" class="py-8 text-center text-cream/40">No orders yet</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
