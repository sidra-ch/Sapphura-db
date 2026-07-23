@extends('layouts.admin')
@section('title', 'Bulk Product Import - Admin')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h1 class="text-2xl font-bold">Bulk Product Import (Phase 2)</h1>
        <p class="text-sm text-cream/50 mt-1">Upload CSV, preview rows, and import with URL or local folder media support.</p>
    </div>
    <a href="/admin/products" class="px-4 py-2 border border-gold/30 text-gold rounded-lg text-sm hover:bg-gold/10 transition">Back to Products</a>
</div>

<div class="grid lg:grid-cols-3 gap-6 mb-6">
    <div class="glass rounded-xl p-5 lg:col-span-2">
        <h2 class="text-lg font-semibold mb-3">Step 1: Upload File</h2>
        <form method="POST" action="{{ route('admin.products.import.preview') }}" enctype="multipart/form-data" class="space-y-4">
            @csrf

            @if($errors->any())
                <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                    @foreach($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <div>
                <label class="block text-sm text-cream/70 mb-1.5">File (CSV or XLSX)</label>
                <input type="file" name="csv_file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required
                    class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-sm">
            </div>

            <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm">
                Preview Import
            </button>
        </form>
    </div>

    <div class="glass rounded-xl p-5">
        <h3 class="text-base font-semibold mb-2">CSV Template</h3>
        <p class="text-xs text-cream/50 mb-3">Use template to avoid column errors. Required columns: name, price, category.</p>
        <a href="{{ route('admin.products.import.template') }}" class="inline-flex px-4 py-2 border border-gold/30 text-gold rounded-lg text-xs hover:bg-gold/10 transition">
            Download Template
        </a>
        <div class="mt-4 text-xs text-cream/50 space-y-1">
            <p>status: active / inactive / draft</p>
            <p>is_featured: yes/no or 1/0</p>
            <p>image_urls and video_urls: separate by |</p>
            <p>Phase 2: you can also use image_files and video_files for local files.</p>
            <p>Excel support: .xlsx (first sheet is imported).</p>
            <p>Local media folders supported: /import-media, /uploads, /storage</p>
        </div>
    </div>
</div>

@if($summary)
    <div class="glass rounded-xl p-5 mb-6">
        <h2 class="text-lg font-semibold mb-3">Step 2: Preview Summary</h2>
        <div class="grid sm:grid-cols-3 gap-3 text-sm">
            <div class="bg-white/5 rounded-lg p-3 border border-gold/10">
                <p class="text-cream/50">Total Rows</p>
                <p class="text-lg font-bold">{{ $summary['total_rows'] ?? 0 }}</p>
            </div>
            <div class="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <p class="text-green-300">Valid Rows</p>
                <p class="text-lg font-bold text-green-300">{{ $summary['valid_rows'] ?? 0 }}</p>
            </div>
            <div class="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <p class="text-red-300">Invalid Rows</p>
                <p class="text-lg font-bold text-red-300">{{ $summary['invalid_rows'] ?? 0 }}</p>
            </div>
        </div>

        @if(($summary['valid_rows'] ?? 0) > 0)
            <form method="POST" action="{{ route('admin.products.import.commit') }}" class="mt-4">
                @csrf
                <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm">
                    Import Valid Rows
                </button>
            </form>
        @endif
    </div>
@endif

@if(!empty($previewRows))
    <div class="glass rounded-xl overflow-hidden">
        <div class="px-5 py-4 border-b border-gold/10">
            <h2 class="text-lg font-semibold">Row-wise Preview</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-gold/10 text-cream/50 text-left">
                        <th class="p-4 font-medium">Row</th>
                        <th class="p-4 font-medium">Name</th>
                        <th class="p-4 font-medium">Category</th>
                        <th class="p-4 font-medium">Price</th>
                        <th class="p-4 font-medium">Media</th>
                        <th class="p-4 font-medium">Status</th>
                        <th class="p-4 font-medium">Errors</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gold/5">
                    @foreach($previewRows as $row)
                        <tr class="hover:bg-white/5 transition">
                            <td class="p-4 font-mono text-xs">{{ $row['row_number'] }}</td>
                            <td class="p-4">{{ $row['name'] }}</td>
                            <td class="p-4 text-cream/60">{{ $row['category'] ?: '—' }}</td>
                            <td class="p-4">{{ is_numeric($row['price']) ? number_format((float) $row['price'], 2) : '—' }}</td>
                            <td class="p-4">{{ $row['media_count'] ?? 0 }}</td>
                            <td class="p-4">
                                @if(($row['status'] ?? 'invalid') === 'valid')
                                    <span class="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Valid</span>
                                @else
                                    <span class="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">Invalid</span>
                                @endif
                            </td>
                            <td class="p-4 text-xs text-red-300">
                                @if(!empty($row['errors']))
                                    {{ implode(' | ', $row['errors']) }}
                                @else
                                    —
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
@endif
@endsection
