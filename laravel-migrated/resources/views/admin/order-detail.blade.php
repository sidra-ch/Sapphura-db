@extends('layouts.admin')
@section('title', 'Order #' . $order->id . ' – Admin')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-3">
        <a href="/admin/orders" class="text-cream/40 hover:text-gold transition">← Orders</a>
        <h1 class="text-2xl font-bold">Order #{{ $order->id }}</h1>
        <span class="px-3 py-1 rounded-full text-xs font-semibold
            @if(in_array($order->status, ['delivered','completed'])) bg-green-500/20 text-green-400
            @elseif($order->status === 'cancelled') bg-red-500/20 text-red-400
            @elseif($order->status === 'shipped') bg-blue-500/20 text-blue-400
            @elseif($order->status === 'processing') bg-purple-500/20 text-purple-400
            @else bg-gold/20 text-gold @endif">
            {{ ucfirst($order->status ?? 'pending') }}
        </span>
    </div>
    <button onclick="window.print()" class="px-4 py-2 border border-gold/30 text-gold rounded-lg text-sm hover:bg-gold/10 transition flex items-center gap-2 no-print">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
        Print Invoice
    </button>
</div>

<div class="grid lg:grid-cols-3 gap-6">
    {{-- Main Content --}}
    <div class="lg:col-span-2 space-y-6">
        {{-- Items --}}
        <div class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Items ({{ $order->items->count() }})</h2>
            <div class="space-y-3">
                @forelse($order->items as $item)
                    <div class="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                        @php
                            $product = $item->product;
                            $imgs = $product ? (is_string($product->images) ? json_decode($product->images, true) : ($product->images ?? [])) : [];
                        @endphp
                        @if(!empty($imgs))
                            <img src="{{ $imgs[0] }}" class="w-14 h-14 object-cover rounded-lg" alt="">
                        @else
                            <div class="w-14 h-14 bg-white/5 rounded-lg flex items-center justify-center text-cream/20 text-xs">N/A</div>
                        @endif
                        <div class="flex-1 min-w-0">
                            <p class="font-medium truncate">{{ $product->name ?? 'Deleted Product' }}</p>
                            <p class="text-xs text-cream/40">SKU: {{ $product->sku ?? '—' }}</p>
                        </div>
                        <div class="text-right text-sm">
                            <p class="text-cream/50">× {{ $item->quantity }}</p>
                            <p class="text-gold font-semibold">Rs. {{ number_format($item->price * $item->quantity) }}</p>
                        </div>
                    </div>
                @empty
                    <p class="text-cream/40 text-sm">No items found</p>
                @endforelse
            </div>
        </div>

        {{-- Shipping Address --}}
        <div class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-3">Shipping Address</h2>
            <div class="text-sm text-cream/70 space-y-1">
                <p class="font-medium text-cream">{{ $order->shipping_name ?? '—' }}</p>
                <p>{{ $order->shipping_address ?? '—' }}</p>
                <p>{{ $order->shipping_city ?? '' }}{{ $order->shipping_postal_code ? ', '.$order->shipping_postal_code : '' }}</p>
                <p>{{ $order->shipping_country ?? 'Pakistan' }}</p>
                @if($order->shipping_phone)
                    <p class="flex items-center gap-1.5 mt-2">
                        <svg class="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        {{ $order->shipping_phone }}
                    </p>
                @endif
            </div>
        </div>

        {{-- Tracking Information --}}
        <div class="glass rounded-xl p-6 no-print">
            <h2 class="text-lg font-semibold mb-4">Tracking Information</h2>
            <form method="POST" action="/admin/orders/{{ $order->id }}/tracking" class="space-y-4">
                @csrf @method('PATCH')
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm text-cream/70 mb-1.5">Carrier</label>
                        <select name="tracking_carrier" class="w-full px-3 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition text-sm [&>option]:text-black [&>option]:bg-white">
                            <option value="">— Select Carrier —</option>
                            @foreach(['TCS', 'Leopards Courier', 'M&P', 'Pakistan Post', 'DHL', 'FedEx', 'BlueEx', 'Trax', 'Call Courier', 'Other'] as $carrier)
                                <option value="{{ $carrier }}" {{ ($order->tracking_carrier ?? '') === $carrier ? 'selected' : '' }}>{{ $carrier }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm text-cream/70 mb-1.5">Tracking Number</label>
                        <input type="text" name="tracking_number" value="{{ $order->tracking_number ?? '' }}" placeholder="Enter tracking number"
                            class="w-full px-3 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition text-sm">
                    </div>
                </div>
                <button type="submit" class="px-6 py-2 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm">Save Tracking</button>
            </form>
            @if($order->tracking_number)
                <div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-2 text-sm text-blue-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    {{ $order->tracking_carrier ?? 'Carrier' }}: <span class="font-mono font-bold">{{ $order->tracking_number }}</span>
                </div>
            @endif
        </div>

        {{-- Order Timeline --}}
        <div class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Order Timeline</h2>
            <div class="space-y-4">
                @forelse($order->statusHistory ?? [] as $history)
                    <div class="flex gap-3">
                        <div class="flex flex-col items-center">
                            <div class="w-3 h-3 rounded-full bg-gold"></div>
                            @if(!$loop->last) <div class="w-0.5 flex-1 bg-gold/20 mt-1"></div> @endif
                        </div>
                        <div class="pb-4">
                            <p class="text-sm font-medium">
                                @if($history->from_status)
                                    {{ ucfirst($history->from_status) }} → {{ ucfirst($history->to_status) }}
                                @else
                                    Order created as {{ ucfirst($history->to_status) }}
                                @endif
                            </p>
                            @if($history->note) <p class="text-xs text-cream/50 mt-0.5">{{ $history->note }}</p> @endif
                            <p class="text-xs text-cream/30 mt-0.5">
                                {{ $history->created_at->format('d M Y, H:i') }}
                                @if($history->changedByUser) · by {{ $history->changedByUser->name ?? 'Admin' }} @endif
                            </p>
                        </div>
                    </div>
                @empty
                    <div class="flex gap-3">
                        <div class="w-3 h-3 rounded-full bg-gold mt-0.5"></div>
                        <div>
                            <p class="text-sm font-medium">Order placed</p>
                            <p class="text-xs text-cream/30">{{ $order->created_at->format('d M Y, H:i') }}</p>
                        </div>
                    </div>
                @endforelse
            </div>
        </div>

        {{-- Admin Notes --}}
        <div class="glass rounded-xl p-6 no-print">
            <h2 class="text-lg font-semibold mb-4">Admin Notes</h2>
            <form method="POST" action="/admin/orders/{{ $order->id }}/notes" class="space-y-3">
                @csrf @method('PATCH')
                <textarea name="admin_notes" rows="3" placeholder="Add internal notes about this order..."
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition text-sm resize-none">{{ $order->admin_notes ?? '' }}</textarea>
                <button type="submit" class="px-6 py-2 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm">Save Notes</button>
            </form>
        </div>
    </div>

    {{-- Sidebar --}}
    <div class="space-y-6">
        {{-- Status Update --}}
        <div class="glass rounded-xl p-6 no-print">
            <h2 class="text-lg font-semibold mb-4">Update Status</h2>
            <form method="POST" action="/admin/orders/{{ $order->id }}/status" class="space-y-3">
                @csrf @method('PATCH')
                <select name="status"
                    class="w-full px-3 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition text-sm [&>option]:text-black [&>option]:bg-white">
                    @foreach(['pending','confirmed','processing','shipped','delivered','completed','cancelled'] as $s)
                        <option value="{{ $s }}" {{ ($order->status ?? 'pending') === $s ? 'selected' : '' }}>{{ ucfirst($s) }}</option>
                    @endforeach
                </select>
                <input type="text" name="status_note" placeholder="Status change note (optional)"
                    class="w-full px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition text-xs">
                <button class="w-full py-2 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm">Update Status</button>
            </form>
        </div>

        {{-- Order Summary --}}
        <div class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Summary</h2>
            <div class="space-y-2 text-sm">
                @php $subtotal = $order->items->sum(fn($i) => $i->price * $i->quantity); @endphp
                <div class="flex justify-between text-cream/60">
                    <span>Subtotal ({{ $order->items->count() }} items)</span>
                    <span>Rs. {{ number_format($subtotal) }}</span>
                </div>
                <div class="flex justify-between text-cream/60">
                    <span>Shipping</span>
                    <span>Rs. {{ number_format($order->shipping_cost ?? 0) }}</span>
                </div>
                @if(($order->discount ?? 0) > 0)
                    <div class="flex justify-between text-green-400">
                        <span>Discount @if($order->discount_code)({{ $order->discount_code }})@endif</span>
                        <span>-Rs. {{ number_format($order->discount) }}</span>
                    </div>
                @endif
                <div class="flex justify-between font-bold text-lg pt-2 border-t border-gold/10">
                    <span>Total</span>
                    <span class="text-gold">Rs. {{ number_format($order->total ?? 0) }}</span>
                </div>
            </div>
        </div>

        {{-- Customer Info --}}
        <div class="glass rounded-xl p-6">
            <h2 class="text-lg font-semibold mb-4">Customer</h2>
            <div class="text-sm space-y-2">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center text-sm font-bold text-gold">
                        {{ strtoupper(substr($order->user->name ?? $order->shipping_name ?? 'U', 0, 1)) }}
                    </div>
                    <div>
                        <p class="font-medium">{{ $order->user->name ?? $order->shipping_name ?? '—' }}</p>
                        <p class="text-cream/50 text-xs">{{ $order->user->email ?? '—' }}</p>
                    </div>
                </div>
                @if($order->user)
                    <a href="/admin/customers/{{ $order->user->id }}" class="block w-full py-2 text-center border border-gold/30 text-gold rounded-lg text-xs hover:bg-gold/10 transition">View Customer Profile</a>
                @endif
            </div>
        </div>

        {{-- Payment Info --}}
        <div class="glass rounded-xl p-6 text-sm space-y-2">
            <h2 class="text-lg font-semibold mb-3">Payment</h2>
            <div class="flex justify-between text-cream/60">
                <span>Method</span>
                <span class="uppercase text-xs font-semibold">{{ $order->payment_method ?? 'N/A' }}</span>
            </div>
            <div class="flex justify-between text-cream/60">
                <span>Payment Status</span>
                <span class="px-2 py-0.5 rounded-full text-xs {{ ($order->payment_status ?? 'pending') === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold' }}">
                    {{ ucfirst($order->payment_status ?? 'pending') }}
                </span>
            </div>
            <div class="flex justify-between text-cream/60">
                <span>Order Date</span>
                <span>{{ $order->created_at->format('d M Y, H:i') }}</span>
            </div>
        </div>
    </div>
</div>

{{-- Print Invoice Styles --}}
@push('styles')
<style>
    @media print {
        body { background: white !important; color: black !important; }
        aside, header, .no-print { display: none !important; }
        .glass { background: white !important; border: 1px solid #ddd !important; box-shadow: none !important; }
        .text-cream, .text-cream\/70, .text-cream\/50, .text-cream\/60, .text-cream\/40, .text-cream\/30 { color: #333 !important; }
        .text-gold { color: #b8860b !important; }
        .bg-white\/5 { background: #f9f9f9 !important; }
        main { padding: 0 !important; }
        .lg\:col-span-2 { grid-column: span 3 !important; }
    }
</style>
@endpush
@endsection
