@extends('layouts.admin')
@section('title', 'Coupons – Admin')

@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">Coupons</h1>
    <a href="/admin/coupons/create" class="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">+ Create Coupon</a>
</div>

<div class="glass rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10 text-cream/50 text-left">
                    <th class="p-4 font-medium">Code</th>
                    <th class="p-4 font-medium">Description</th>
                    <th class="p-4 font-medium">Type</th>
                    <th class="p-4 font-medium">Value</th>
                    <th class="p-4 font-medium">Min Order</th>
                    <th class="p-4 font-medium">Usage</th>
                    <th class="p-4 font-medium">Valid Until</th>
                    <th class="p-4 font-medium">Status</th>
                    <th class="p-4 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($coupons as $coupon)
                    <tr class="hover:bg-white/5 transition">
                        <td class="p-4 font-mono font-bold text-gold">{{ $coupon->code }}</td>
                        <td class="p-4 text-cream/60">{{ Str::limit($coupon->description ?? '—', 40) }}</td>
                        <td class="p-4">
                            <span class="px-2 py-0.5 rounded-full text-xs {{ $coupon->type === 'percentage' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400' }}">
                                {{ ucfirst($coupon->type) }}
                            </span>
                        </td>
                        <td class="p-4 font-semibold">
                            @if($coupon->type === 'percentage')
                                {{ $coupon->value }}%
                            @else
                                Rs. {{ number_format($coupon->value) }}
                            @endif
                        </td>
                        <td class="p-4 text-cream/60">Rs. {{ number_format($coupon->min_order ?? 0) }}</td>
                        <td class="p-4">
                            <span class="text-gold font-semibold">{{ $coupon->used_count ?? 0 }}</span>
                            <span class="text-cream/30">/ {{ $coupon->max_uses ?? '∞' }}</span>
                        </td>
                        <td class="p-4 text-cream/60">
                            @if($coupon->valid_until)
                                {{ \Carbon\Carbon::parse($coupon->valid_until)->format('d M Y') }}
                                @if(\Carbon\Carbon::parse($coupon->valid_until)->isPast())
                                    <span class="text-red-400 text-xs ml-1">Expired</span>
                                @endif
                            @else
                                No expiry
                            @endif
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-0.5 rounded-full text-xs {{ $coupon->is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400' }}">
                                {{ $coupon->is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-2">
                                <a href="/admin/coupons/{{ $coupon->id }}/edit" class="px-3 py-1 border border-gold/30 text-gold rounded text-xs hover:bg-gold/10 transition">Edit</a>
                                <form method="POST" action="/admin/coupons/{{ $coupon->id }}" onsubmit="return confirm('Delete this coupon?')">
                                    @csrf @method('DELETE')
                                    <button class="px-3 py-1 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/10 transition">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="9" class="p-8 text-center text-cream/40">No coupons yet. Create your first coupon!</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@if(method_exists($coupons, 'links'))
    <div class="mt-6">{{ $coupons->links() }}</div>
@endif
@endsection