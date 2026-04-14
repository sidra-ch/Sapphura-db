@extends('layouts.admin')
@section('title', isset($product) ? 'Edit Product – Admin' : 'Add Product – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">{{ isset($product) ? 'Edit Product' : 'Add Product' }}</h1>

<form method="POST" action="{{ isset($product) ? '/admin/products/'.$product->id : '/admin/products' }}" enctype="multipart/form-data" class="max-w-3xl space-y-6">
    @csrf
    @if(isset($product)) @method('PUT') @endif

    @if($errors->any())
        <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
            @foreach($errors->all() as $error) <p>{{ $error }}</p> @endforeach
        </div>
    @endif

    <div class="glass rounded-xl p-6 space-y-5">
        <div>
            <label class="block text-sm text-cream/70 mb-1.5">Product Name *</label>
            <input type="text" name="name" value="{{ old('name', $product->name ?? '') }}" required
                class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
        </div>
        <div>
            <label class="block text-sm text-cream/70 mb-1.5">Slug</label>
            <input type="text" name="slug" value="{{ old('slug', $product->slug ?? '') }}"
                class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition"
                placeholder="auto-generated if empty">
        </div>
        <div>
            <label class="block text-sm text-cream/70 mb-1.5">Description</label>
            <textarea name="description" rows="4"
                class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition resize-none">{{ old('description', $product->description ?? '') }}</textarea>
        </div>
        <div>
            <label class="block text-sm text-cream/70 mb-1.5">Category</label>
            <select name="category_id"
                class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition [&>option]:text-black [&>option]:bg-white">
                <option value="">— Select Category —</option>
                @foreach($categories ?? [] as $cat)
                    <option value="{{ $cat->id }}" {{ old('category_id', $product->category_id ?? '') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                @endforeach
            </select>
        </div>
    </div>

    <div class="glass rounded-xl p-6 space-y-5">
        <h3 class="text-lg font-semibold">Pricing & Inventory</h3>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Price (Rs.) *</label>
                <input type="number" name="price" value="{{ old('price', $product->price ?? '') }}" required step="0.01"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Sale Price (Rs.)</label>
                <input type="number" name="sale_price" value="{{ old('sale_price', $product->sale_price ?? '') }}" step="0.01"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Stock</label>
                <input type="number" name="stock" value="{{ old('stock', $product->stock ?? 0) }}"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">SKU</label>
                <input type="text" name="sku" value="{{ old('sku', $product->sku ?? '') }}"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
        </div>
    </div>

    <div class="glass rounded-xl p-6 space-y-5">
        <h3 class="text-lg font-semibold">Images</h3>
        <p class="text-xs text-cream/40">Enter image URLs, one per line</p>
        @php
            $imgs = old('images', isset($product) ? (is_string($product->images) ? implode("\n", json_decode($product->images, true) ?? []) : implode("\n", $product->images ?? [])) : '');
        @endphp
        <textarea name="images" rows="4"
            class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition resize-none font-mono text-xs"
            placeholder="https://res.cloudinary.com/...">{{ $imgs }}</textarea>
    </div>

    <div class="glass rounded-xl p-6 space-y-5">
        <h3 class="text-lg font-semibold">Settings</h3>
        <div class="flex flex-wrap gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" value="1" {{ old('is_active', $product->is_active ?? true) ? 'checked' : '' }}
                    class="w-4 h-4 rounded border-gold/30 bg-white/5 text-gold focus:ring-gold/50">
                <span class="text-sm">Active</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $product->is_featured ?? false) ? 'checked' : '' }}
                    class="w-4 h-4 rounded border-gold/30 bg-white/5 text-gold focus:ring-gold/50">
                <span class="text-sm">Featured / Best Seller</span>
            </label>
        </div>
    </div>

    <div class="flex gap-3">
        <button type="submit"
            class="px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">
            {{ isset($product) ? 'Update Product' : 'Create Product' }}
        </button>
        <a href="/admin/products" class="px-8 py-3 border border-gold/30 text-gold rounded-lg text-sm tracking-wider uppercase">Cancel</a>
    </div>
</form>
@endsection
