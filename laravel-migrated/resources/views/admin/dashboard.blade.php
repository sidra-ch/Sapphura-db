@extends('layouts.admin')
@section('title', 'Dashboard – Admin')

@section('content')
<div class="mb-8">
    <h1 class="text-4xl font-light text-cream mb-2" style="font-family:Georgia,serif;">Dashboard</h1>
    <p class="text-cream/60 text-sm">Welcome back! Here's your business overview.</p>
</div>

{{-- Primary Stats Grid --}}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="glass rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-cream/50 text-xs uppercase tracking-wider font-light mb-1">Total Revenue</p>
                <p class="text-3xl font-light text-gold">Rs. {{ number_format($stats['revenue'] ?? 0) }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition">
                <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
        </div>
        <p class="text-[11px] text-cream/40">All-time earnings</p>
    </div>

    <div class="glass rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-cream/50 text-xs uppercase tracking-wider font-light mb-1">Today's Revenue</p>
                <p class="text-3xl font-light text-green-400">Rs. {{ number_format($stats['todayRevenue'] ?? 0) }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
            </div>
        </div>
        <p class="text-[11px] text-cream/40">Today only</p>
    </div>

    <div class="glass rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-cream/50 text-xs uppercase tracking-wider font-light mb-1">Total Orders</p>
                <p class="text-3xl font-light">{{ $stats['orders'] ?? 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
            </div>
        </div>
        <p class="text-[11px] text-cream/40">Today: {{ $stats['todayOrders'] ?? 0 }}</p>
    </div>

    <div class="glass rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all group">
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-cream/50 text-xs uppercase tracking-wider font-light mb-1">Total Customers</p>
                <p class="text-3xl font-light">{{ $stats['customers'] ?? 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 19H9a6 6 0 016-6v0a6 6 0 016 6v1m0 0h.01"/>
                </svg>
            </div>
        </div>
        <p class="text-[11px] text-cream/40">Registered</p>
    </div>
</div>

{{-- Order Status Summary --}}
<div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
    <div class="glass rounded-lg p-5 border border-gold/10 text-center hover:bg-gold/5 transition">
        <p class="text-sm font-semibold text-gold mb-2">{{ $stats['pending'] ?? 0 }}</p>
        <p class="text-xs text-cream/50 uppercase tracking-wider">Pending</p>
    </div>
    <div class="glass rounded-lg p-5 border border-gold/10 text-center hover:bg-purple-500/5 transition">
        <p class="text-sm font-semibold text-purple-400 mb-2">{{ $stats['processing'] ?? 0 }}</p>
        <p class="text-xs text-cream/50 uppercase tracking-wider">Processing</p>
    </div>
    <div class="glass rounded-lg p-5 border border-gold/10 text-center hover:bg-blue-500/5 transition">
        <p class="text-sm font-semibold text-blue-400 mb-2">{{ $stats['shipped'] ?? 0 }}</p>
        <p class="text-xs text-cream/50 uppercase tracking-wider">Shipped</p>
    </div>
    <div class="glass rounded-lg p-5 border border-gold/10 text-center hover:bg-blue-500/5 transition">
        <p class="text-sm font-semibold mb-2">{{ $stats['products'] ?? 0 }}</p>
        <p class="text-xs text-cream/50 uppercase tracking-wider">Products</p>
    </div>
    <div class="glass rounded-lg p-5 border border-gold/10 text-center hover:bg-red-500/5 transition">
        <p class="text-sm font-semibold {{ ($stats['lowStock'] ?? 0) > 0 ? 'text-red-400' : 'text-green-400' }} mb-2">{{ $stats['lowStock'] ?? 0 }}</p>
        <p class="text-xs text-cream/50 uppercase tracking-wider">Low Stock</p>
    </div>
</div>

<div class="grid lg:grid-cols-3 gap-6 mb-8">
    {{-- Revenue Chart --}}
    <div class="lg:col-span-2 glass rounded-lg p-8 border border-gold/10">
        <div class="mb-6">
            <h2 class="text-xl font-light text-cream mb-1" style="font-family:Georgia,serif;">Revenue Trend</h2>
            <p class="text-sm text-cream/50">Last 7 days performance</p>
        </div>
        <div class="h-56 flex items-end gap-3 justify-between" id="revenueChart">
            @php $maxRev = max(array_column($revenueChart ?? [], 'revenue') ?: [1]); @endphp
            @foreach($revenueChart ?? [] as $day)
                <div class="flex-1 flex flex-col items-center gap-2 group">
                    <div class="relative w-full flex flex-col items-center">
                        <span class="text-[10px] text-cream/40 group-hover:text-gold transition opacity-0 group-hover:opacity-100 mb-1">Rs. {{ number_format($day['revenue']) }}</span>
                        <div class="w-full bg-gradient-to-t from-gold/80 to-gold rounded-t-lg transition-all hover:from-gold to-gold/90 hover:shadow-lg hover:shadow-gold/20"
                             style="height: {{ $maxRev > 0 ? max(($day['revenue'] / $maxRev) * 150, 8) : 8 }}px"></div>
                    </div>
                    <span class="text-[10px] text-cream/50 font-light">{{ substr($day['date'], 5) }}</span>
                    <span class="text-[9px] text-cream/30">{{ $day['orders'] }} ord.</span>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Order Status Distribution --}}
    <div class="glass rounded-lg p-8 border border-gold/10">
        <div class="mb-6">
            <h2 class="text-xl font-light text-cream mb-1" style="font-family:Georgia,serif;">Order Status</h2>
            <p class="text-sm text-cream/50">Distribution</p>
        </div>
        <div class="space-y-4">
            @php
                $statusColors = ['pending' => 'from-gold to-gold/60', 'confirmed' => 'from-yellow-500 to-yellow-600', 'processing' => 'from-purple-500 to-purple-600', 'shipped' => 'from-blue-500 to-blue-600', 'delivered' => 'from-green-500 to-green-600', 'completed' => 'from-green-600 to-green-700', 'cancelled' => 'from-red-500 to-red-600'];
                $totalOrders = array_sum($statusDistribution ?? []) ?: 1;
            @endphp
            @foreach($statusDistribution ?? [] as $status => $count)
                <div class="group">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="capitalize text-cream/80 group-hover:text-cream transition">{{ $status }}</span>
                        <span class="text-cream/60">{{ $count }}</span>
                    </div>
                    <div class="w-full bg-navy/50 rounded-full h-2.5 overflow-hidden">
                        <div class="bg-gradient-to-r {{ $statusColors[$status] ?? 'from-gold to-gold/60' }} rounded-full h-2.5 transition-all group-hover:shadow-lg group-hover:shadow-{{ explode(' ', $statusColors[$status] ?? 'from-gold to-gold/60')[1] }}/20" 
                             style="width: {{ ($count / $totalOrders) * 100 }}%"></div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<div class="grid lg:grid-cols-2 gap-6 mb-8">
    {{-- Top Selling Products --}}
    <div class="glass rounded-lg p-8 border border-gold/10">
        <div class="mb-6">
            <h2 class="text-xl font-light text-cream mb-1" style="font-family:Georgia,serif;">Top Selling Products</h2>
            <p class="text-sm text-cream/50">Best performers this month</p>
        </div>
        <div class="space-y-4">
            @forelse($topProducts ?? [] as $idx => $tp)
                <div class="flex items-center gap-4 p-4 bg-navy/30 hover:bg-navy/50 rounded-lg transition-all group border border-gold/5 hover:border-gold/20">
                    <span class="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold/60 text-ink text-xs flex items-center justify-center font-bold">{{ $idx + 1 }}</span>
                    @php $tpImages = data_get($tp, 'images'); $tpImg = is_string($tpImages) ? json_decode($tpImages, true) : ($tpImages ?? []); @endphp
                    @if(!empty($tpImg))
                        <img src="{{ $tpImg[0] }}" class="w-12 h-12 object-cover rounded-lg flex-shrink-0" alt="">
                    @else
                        <div class="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-6 h-6 text-cream/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    @endif
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-cream truncate">{{ data_get($tp, 'name') }}</p>
                        <p class="text-xs text-cream/50">{{ data_get($tp, 'total_sold', 0) }} sold · {{ number_format(data_get($tp, 'total_sold', 0) * (data_get($tp, 'price', 0) / 1000)) }} units</p>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <p class="text-gold font-semibold">Rs. {{ number_format(data_get($tp, 'total_revenue', 0)) }}</p>
                        <p class="text-xs text-cream/50">Revenue</p>
                    </div>
                </div>
            @empty
                <div class="py-8 text-center text-cream/40">
                    <p class="text-sm">No sales data yet</p>
                </div>
            @endforelse
        </div>
    </div>

    {{-- Low Stock Alerts --}}
    <div class="glass rounded-lg p-8 border border-gold/10">
        <div class="mb-6">
            <h2 class="text-xl font-light text-cream mb-1" style="font-family:Georgia,serif;">Stock Alerts</h2>
            <p class="text-sm text-cream/50">
                @if(($stats['lowStock'] ?? 0) > 0)
                    <span class="inline-block px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-300">{{ $stats['lowStock'] }} items low</span>
                @else
                    <span class="text-green-400">All items well stocked</span>
                @endif
            </p>
        </div>
        <div class="space-y-4">
            @forelse($lowStockProducts ?? [] as $lsp)
                <div class="flex items-center gap-4 p-4 bg-navy/30 hover:bg-navy/50 rounded-lg transition-all border border-gold/5 hover:border-gold/20 group">
                    @php $lspImages = data_get($lsp, 'images'); $lspImg = is_string($lspImages) ? json_decode($lspImages, true) : ($lspImages ?? []); @endphp
                    @if(!empty($lspImg))
                        <img src="{{ $lspImg[0] }}" class="w-12 h-12 object-cover rounded-lg flex-shrink-0" alt="">
                    @else
                        <div class="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-6 h-6 text-cream/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    @endif
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-cream truncate">{{ data_get($lsp, 'name') }}</p>
                        <p class="text-xs text-cream/50">SKU: {{ data_get($lsp, 'sku', 'N/A') }}</p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <span class="px-3 py-1.5 rounded-full text-xs font-semibold {{ data_get($lsp, 'stock', 0) == 0 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300' }}">
                            {{ data_get($lsp, 'stock', 0) == 0 ? '⚠ Out' : data_get($lsp, 'stock', 0) . ' left' }}
                        </span>
                        <a href="/admin/products/{{ data_get($lsp, 'public_id') ?: data_get($lsp, 'id') }}/edit" class="text-gold hover:text-gold/80 font-semibold text-xs transition">Edit</a>
                    </div>
                </div>
            @empty
                <div class="py-8 text-center text-green-400">
                    <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <p class="text-sm font-semibold">All products well stocked!</p>
                </div>
            @endforelse
        </div>
    </div>
</div>

{{-- Recent Orders --}}
<div class="glass rounded-lg p-8 border border-gold/10">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-xl font-light text-cream mb-1" style="font-family:Georgia,serif;">Recent Orders</h2>
            <p class="text-sm text-cream/50">Latest transactions</p>
        </div>
        <a href="/admin/orders" class="px-4 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 text-sm font-semibold transition">View All →</a>
    </div>
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10">
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Order ID</th>
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Customer</th>
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Total</th>
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Payment</th>
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Status</th>
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Date</th>
                    <th class="pb-4 px-4 text-left font-semibold text-cream/70 text-xs uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($recentOrders ?? [] as $order)
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="py-4 px-4 font-mono text-gold font-semibold">#{{ data_get($order, 'id') }}</td>
                        <td class="py-4 px-4 text-cream">{{ data_get($order, 'shipping_name') ?? data_get($order, 'user.name') ?? 'N/A' }}</td>
                        <td class="py-4 px-4 font-semibold text-gold">Rs. {{ number_format(data_get($order, 'total', 0)) }}</td>
                        <td class="py-4 px-4 text-cream/60 text-xs uppercase tracking-wider">{{ data_get($order, 'payment_method') ?? '—' }}</td>
                        <td class="py-4 px-4">
                            <span class="px-3 py-1.5 rounded-full text-xs font-semibold
                                @if(in_array(data_get($order, 'status'), ['delivered','completed'])) bg-green-500/20 text-green-300
                                @elseif(data_get($order, 'status') === 'cancelled') bg-red-500/20 text-red-300
                                @elseif(data_get($order, 'status') === 'shipped') bg-blue-500/20 text-blue-300
                                @elseif(data_get($order, 'status') === 'processing') bg-purple-500/20 text-purple-300
                                @else bg-gold/20 text-gold @endif">
                                {{ ucfirst(data_get($order, 'status', 'pending')) }}
                            </span>
                        </td>
                        <td class="py-4 px-4 text-cream/60">{{ optional(data_get($order, 'created_at'))->format('d M Y') }}</td>
                        <td class="py-4 px-4">
                            <a href="/admin/orders/{{ data_get($order, 'public_id') ?: data_get($order, 'id') }}" class="text-gold hover:text-gold/80 font-semibold text-xs transition">View →</a>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="7" class="py-12 text-center text-cream/40 text-sm">No orders yet</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
