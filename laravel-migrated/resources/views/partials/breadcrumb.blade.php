@props(['items' => []])

<nav class="mb-6 text-xs text-cream/40" aria-label="Breadcrumb">
    <ol class="flex items-center flex-wrap gap-1">
        <li><a href="/" class="hover:text-gold transition">Home</a></li>
        @foreach($items as $index => $item)
            <li class="flex items-center gap-1">
                <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                @if(isset($item['url']))
                    <a href="{{ $item['url'] }}" class="hover:text-gold transition">{{ $item['label'] }}</a>
                @else
                    <span class="text-cream/70">{{ $item['label'] }}</span>
                @endif
            </li>
        @endforeach
    </ol>
</nav>
