<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') – Sapphura</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { theme: { extend: { colors: { gold: '#d4af37', 'gold-light': '#e8c967', navy: '#0a1630', 'navy-soft': '#13213f', ink: '#09111f', cream: '#fff7ef' } } } }</script>
    <style>body { font-family: system-ui, sans-serif; background: #09111f; color: #fff7ef; }</style>
    @stack('styles')
</head>
<body class="min-h-screen flex" x-data="{ sidebarOpen: true }">
    {{-- Sidebar --}}
    <aside :class="sidebarOpen ? 'w-64' : 'w-16'" class="bg-ink border-r border-gold/10 min-h-screen transition-all duration-300 flex flex-col">
        <div class="p-4 border-b border-gold/10 flex items-center justify-between">
            <a href="/admin" class="flex items-center gap-2" x-show="sidebarOpen">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                    <span class="text-ink font-bold text-sm">S</span>
                </div>
                <span class="font-bold tracking-widest text-sm">ADMIN</span>
            </a>
            <button @click="sidebarOpen = !sidebarOpen" class="text-cream/60 hover:text-gold transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
        </div>
        <nav class="flex-1 py-4 space-y-1">
            @php $current = request()->path(); @endphp
            @foreach([
                ['admin', 'Dashboard', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'],
                ['admin/products', 'Products', 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'],
                ['admin/orders', 'Orders', 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
                ['admin/categories', 'Categories', 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'],
                ['admin/customers', 'Customers', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
                ['admin/coupons', 'Coupons', 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'],
                ['admin/reviews', 'Reviews', 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'],
                ['admin/settings', 'Settings', 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'],
            ] as [$path, $label, $icon])
                <a href="/{{ $path }}"
                   class="flex items-center gap-3 px-4 py-2.5 text-sm transition {{ $current === $path ? 'text-gold bg-gold/10 border-r-2 border-gold' : 'text-cream/60 hover:text-gold hover:bg-gold/5' }}">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $icon }}"/></svg>
                    <span x-show="sidebarOpen">{{ $label }}</span>
                </a>
            @endforeach
        </nav>
        <div class="p-4 border-t border-gold/10">
            <a href="/" class="flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <span x-show="sidebarOpen">Back to Store</span>
            </a>
        </div>
    </aside>

    {{-- Main Content --}}
    <div class="flex-1 flex flex-col min-h-screen">
        <header class="bg-ink/80 backdrop-blur border-b border-gold/10 px-6 py-4 flex items-center justify-between">
            <h1 class="text-lg font-bold tracking-wider">@yield('page-title', 'Dashboard')</h1>
            <div class="flex items-center gap-3">
                <span class="text-sm text-cream/50">Admin</span>
            </div>
        </header>
        <main class="flex-1 p-6">
            @if(session('success'))
                <div class="mb-4 p-3 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-sm">{{ session('success') }}</div>
            @endif
            @if(session('error'))
                <div class="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm">{{ session('error') }}</div>
            @endif
            @yield('content')
        </main>
    </div>

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @stack('scripts')
</body>
</html>
