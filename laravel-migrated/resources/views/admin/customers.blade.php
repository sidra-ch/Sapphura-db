@extends('layouts.admin')
@section('title', 'Customers – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Customers</h1>

{{-- Search --}}
<div class="glass rounded-xl p-4 mb-6">
    <form method="GET" action="/admin/customers" class="flex gap-3">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by name, email, or phone..."
            class="flex-1 px-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
        <button type="submit" class="px-5 py-2 bg-gold/20 text-gold rounded-lg text-sm font-semibold hover:bg-gold/30 transition">Search</button>
        @if(request('search'))
            <a href="/admin/customers" class="px-4 py-2 border border-gold/20 text-cream/50 rounded-lg text-sm hover:text-gold transition">Clear</a>
        @endif
    </form>
</div>

<div class="glass rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10 text-cream/50 text-left">
                    <th class="p-4 font-medium">Customer</th>
                    <th class="p-4 font-medium">Email</th>
                    <th class="p-4 font-medium">Phone</th>
                    <th class="p-4 font-medium">Orders</th>
                    <th class="p-4 font-medium">Total Spent</th>
                    <th class="p-4 font-medium">Joined</th>
                    <th class="p-4 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($customers as $customer)
                    <tr class="hover:bg-white/5 transition">
                        <td class="p-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-xs font-bold text-gold">
                                    {{ strtoupper(substr($customer->name ?? 'U', 0, 1)) }}
                                </div>
                                <span class="font-medium">{{ $customer->name ?? '—' }}</span>
                            </div>
                        </td>
                        <td class="p-4 text-cream/60">{{ $customer->email }}</td>
                        <td class="p-4 text-cream/60">{{ $customer->phone ?? '—' }}</td>
                        <td class="p-4 text-gold font-semibold">{{ $customer->orders_count ?? 0 }}</td>
                        <td class="p-4 font-semibold">Rs. {{ number_format($customer->orders_sum_total ?? 0) }}</td>
                        <td class="p-4 text-cream/50">{{ $customer->created_at->format('d M Y') }}</td>
                        <td class="p-4">
                            <a href="/admin/customers/{{ $customer->id }}" class="px-3 py-1 border border-gold/30 text-gold rounded text-xs hover:bg-gold/10 transition">View</a>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="7" class="p-8 text-center text-cream/40">No customers found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@if(method_exists($customers, 'links'))
    <div class="mt-6">{{ $customers->links() }}</div>
@endif
@endsection
