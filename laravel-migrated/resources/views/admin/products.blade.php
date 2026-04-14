@extends('layouts.admin')
@section('title', 'Products – Admin')

@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">Products</h1>
    <a href="/admin/products/create" class="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">+ Add Product</a>
</div>

{{-- Search & Filters --}}
<div class="glass rounded-xl p-4 mb-6">
    <form method="GET" action="/admin/products" class="flex flex-wrap gap-3">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search products..."
            class="flex-1 min-w-[200px] px-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
        <select name="category" class="px-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
            <option value="" class="bg-ink">All Categories</option>
            @foreach($categories as $cat)
                <option value="{{ $cat->id }}" {{ request('category') == $cat->id ? 'selected' : '' }} class="bg-ink">{{ $cat->name }}</option>
            @endforeach
        </select>
        <select name="stock" class="px-4 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
            <option value="" class="bg-ink">All Stock</option>
            <option value="low" {{ request('stock') === 'low' ? 'selected' : '' }} class="bg-ink">Low Stock (&lt; 5)</option>
            <option value="out" {{ request('stock') === 'out' ? 'selected' : '' }} class="bg-ink">Out of Stock</option>
        </select>
        <button type="submit" class="px-5 py-2 bg-gold/20 text-gold rounded-lg text-sm font-semibold hover:bg-gold/30 transition">Filter</button>
        @if(request()->hasAny(['search', 'category', 'stock']))
            <a href="/admin/products" class="px-4 py-2 border border-gold/20 text-cream/50 rounded-lg text-sm hover:text-gold transition">Clear</a>
        @endif
    </form>
</div>

<div class="glass rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10 text-cream/50 text-left">
                    <th class="p-4 font-medium">Image</th>
                    <th class="p-4 font-medium">Name</th>
                    <th class="p-4 font-medium">Category</th>
                    <th class="p-4 font-medium">Price</th>
                    <th class="p-4 font-medium">Stock</th>
                    <th class="p-4 font-medium">Status</th>
                    <th class="p-4 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($products as $product)
                    <tr class="hover:bg-white/5 transition">
                        <td class="p-4">
                            @php $img = is_string($product->images) ? json_decode($product->images, true) : ($product->images ?? []); @endphp
                            @if(!empty($img))
                                <img src="{{ $img[0] }}" class="w-12 h-12 object-cover rounded-lg" alt="">
                            @else
                                <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-cream/20 text-xs">N/A</div>
                            @endif
                        </td>
                        <td class="p-4 font-medium">{{ $product->name }}</td>
                        <td class="p-4 text-cream/60">{{ $product->category->name ?? '—' }}</td>
                        <td class="p-4">
                            @if($product->sale_price)
                                <span class="text-gold">Rs. {{ number_format($product->sale_price) }}</span>
                                <span class="line-through text-cream/30 text-xs ml-1">{{ number_format($product->price) }}</span>
                            @else
                                Rs. {{ number_format($product->price) }}
                            @endif
                        </td>
                        <td class="p-4">
                            <span class="{{ ($product->stock ?? 0) < 5 ? 'text-red-400' : 'text-green-400' }}">{{ $product->stock ?? 0 }}</span>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-0.5 rounded-full text-xs {{ ($product->is_active ?? true) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400' }}">
                                {{ ($product->is_active ?? true) ? 'Active' : 'Draft' }}
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="flex gap-2">
                                <a href="/admin/products/{{ $product->id }}/edit" class="px-3 py-1 border border-gold/30 text-gold rounded text-xs hover:bg-gold/10 transition">Edit</a>
                                <form method="POST" action="/admin/products/{{ $product->id }}" onsubmit="return confirm('Delete this product?')">
                                    @csrf @method('DELETE')
                                    <button class="px-3 py-1 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/10 transition">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="7" class="p-8 text-center text-cream/40">No products found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@if(method_exists($products, 'links'))
    <div class="mt-6">{{ $products->links() }}</div>
@endif
@endsection
