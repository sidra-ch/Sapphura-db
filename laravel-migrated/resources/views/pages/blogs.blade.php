@extends('layouts.app')
@section('title', 'Blog – Sapphura')

@section('content')
<div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-3">Blog</h1>
        <p class="text-cream/60">Tips, trends, and stories from the world of beauty</p>
    </div>

    @if(isset($blogs) && count($blogs))
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($blogs as $blog)
                <article class="glass rounded-xl overflow-hidden group">
                    @if($blog->image)
                        <div class="aspect-[16/10] overflow-hidden">
                            <img src="{{ $blog->image }}" alt="{{ $blog->title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        </div>
                    @endif
                    <div class="p-5">
                        <p class="text-xs text-gold mb-2">{{ $blog->created_at->format('d M Y') }}</p>
                        <h2 class="font-semibold mb-2 group-hover:text-gold transition">{{ $blog->title }}</h2>
                        <p class="text-cream/50 text-sm line-clamp-3">{{ $blog->excerpt ?? Str::limit(strip_tags($blog->content), 120) }}</p>
                    </div>
                </article>
            @endforeach
        </div>
    @else
        <div class="glass rounded-xl p-16 text-center">
            <svg class="w-16 h-16 text-cream/10 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            <h2 class="text-xl font-semibold mb-2">Coming Soon</h2>
            <p class="text-cream/50">We're working on exciting articles. Stay tuned!</p>
        </div>
    @endif
</div>
@endsection
