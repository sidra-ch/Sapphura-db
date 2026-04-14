@extends('layouts.admin')
@section('title', 'Categories – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Categories</h1>

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
    <div class="lg:col-span-2">
        <div class="glass rounded-xl overflow-hidden">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gold/10 text-cream/50 text-left">
                        <th class="p-4 font-medium">Image</th>
                        <th class="p-4 font-medium">Name</th>
                        <th class="p-4 font-medium">Slug</th>
                        <th class="p-4 font-medium">Products</th>
                        <th class="p-4 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gold/5">
                    @forelse($categories as $cat)
                        <tr class="hover:bg-white/5 transition">
                            <td class="p-4">
                                @if($cat->image)
                                    <img src="{{ $cat->image }}" class="w-10 h-10 object-cover rounded-lg" alt="">
                                @else
                                    <div class="w-10 h-10 bg-white/5 rounded-lg"></div>
                                @endif
                            </td>
                            <td class="p-4 font-medium">{{ $cat->name }}</td>
                            <td class="p-4 text-cream/40 font-mono text-xs">{{ $cat->slug }}</td>
                            <td class="p-4">{{ $cat->products_count ?? $cat->products()->count() }}</td>
                            <td class="p-4">
                                <form method="POST" action="/admin/categories/{{ $cat->id }}" onsubmit="return confirm('Delete this category?')">
                                    @csrf @method('DELETE')
                                    <button class="px-3 py-1 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/10 transition">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="p-8 text-center text-cream/40">No categories found</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
