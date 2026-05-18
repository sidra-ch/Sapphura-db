@extends('layouts.admin')
@section('title', 'Categories – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Categories</h1>

{{-- Flash messages --}}
@if(session('success'))
    <div class="bg-green-500/15 border border-green-500/30 text-green-400 rounded-lg px-4 py-3 mb-5 text-sm">✓ {{ session('success') }}</div>
@endif
@if(session('error'))
    <div class="bg-red-500/15 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-5 text-sm">⚠ {{ session('error') }}</div>
@endif

<div class="grid lg:grid-cols-3 gap-6">
    {{-- Add Category --}}
    <div class="glass rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4">Add Category</h2>
        @if($errors->any())
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm text-red-300">
                @foreach($errors->all() as $error) <p>{{ $error }}</p> @endforeach
            </div>
        @endif
        <form method="POST" action="/admin/categories" class="space-y-4">
            @csrf
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Name *</label>
                <input type="text" name="name" value="{{ old('name') }}" required
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Slug</label>
                <input type="text" name="slug" value="{{ old('slug') }}"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition"
                    placeholder="auto-generated if empty">
            </div>
            <div>
                <label class="block text-sm text-cream/70 mb-1.5">Image URL</label>
                <input type="url" name="image" value="{{ old('image') }}"
                    class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition">
            </div>
            <button type="submit"
                class="w-full py-2.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">
                Add Category
            </button>
        </form>
    </div>

    {{-- Categories List --}}
    <div class="lg:col-span-2" x-data="{ editing: null }">
        <div class="glass rounded-xl overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gold/10 text-cream/50 text-left">
                        <th class="p-4 font-medium">Image</th>
                        <th class="p-4 font-medium">Name</th>
                        <th class="p-4 font-medium">Products</th>
                        <th class="p-4 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gold/5">
                    @forelse($categories as $cat)
                        @php
                            $productsCount = $cat->products_count ?? $cat->products()->count();
                            $deleteMessage = "Delete '{$cat->name}'?" . ($productsCount > 0 ? " This has {$productsCount} products - they will become uncategorized." : "");
                        @endphp
                        <tr class="hover:bg-white/5 transition">
                            <td class="p-4">
                                @if($cat->image)
                                    <img src="{{ $cat->image }}" class="w-10 h-10 object-cover rounded-lg" alt="">
                                @else
                                    <div class="w-10 h-10 bg-white/5 rounded-lg"></div>
                                @endif
                            </td>
                            <td class="p-4">
                                {{-- Normal view --}}
                                <span x-show="editing !== {{ $cat->id }}" class="font-medium">{{ $cat->name }}</span>
                                <span x-show="editing !== {{ $cat->id }}" class="block text-[10px] text-cream/30 font-mono">{{ $cat->slug }}</span>
                                {{-- Inline rename form --}}
                                <form x-show="editing === {{ $cat->id }}" method="POST" action="/admin/categories/{{ $cat->id }}/rename" x-cloak>
                                    @csrf @method('PUT')
                                    <input type="text" name="name" value="{{ $cat->name }}" required
                                        class="w-full px-3 py-1.5 bg-white/5 border border-gold/40 rounded text-cream text-sm focus:border-gold outline-none">
                                    <div class="flex gap-1.5 mt-1.5">
                                        <button type="submit" class="px-3 py-1 bg-gold/80 text-ink rounded text-xs font-semibold hover:bg-gold transition">Save</button>
                                        <button type="button" @click="editing = null" class="px-3 py-1 border border-white/20 text-cream/50 rounded text-xs hover:text-cream transition">Cancel</button>
                                    </div>
                                </form>
                            </td>
                            <td class="p-4 text-cream/50">{{ $productsCount }}</td>
                            <td class="p-4">
                                <div class="flex gap-2 flex-wrap">
                                    <button @click="editing = (editing === {{ $cat->id }} ? null : {{ $cat->id }})"
                                        class="px-3 py-1 border border-gold/30 text-gold/70 rounded text-xs hover:bg-gold/10 transition">Rename</button>
                                    <form method="POST" action="/admin/categories/{{ $cat->id }}"
                                          onsubmit="return confirm({{ \Illuminate\Support\Js::from($deleteMessage) }})">
                                        @csrf @method('DELETE')
                                        <button class="px-3 py-1 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/10 transition">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="4" class="p-8 text-center text-cream/40">No categories found</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <p class="text-[11px] text-cream/25 mt-2 px-1">
            💡 Tip: Use <strong class="text-cream/40">Rename</strong> to change a category name without losing its products.
            Deleting a category with products will move them to "Uncategorized".
        </p>
    </div>
</div>

<style>[x-cloak]{display:none!important}</style>
@endsection
