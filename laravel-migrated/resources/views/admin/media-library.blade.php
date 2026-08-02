@extends('layouts.admin')
@section('title', 'Media Library – Admin')
@section('page-title', 'Media Library')

@section('content')
<div class="flex items-center justify-between mb-6">
    <div>
        <h1 class="text-2xl font-bold">Media Library</h1>
        <p class="text-cream/40 text-sm mt-1">Upload images & videos to Cloudinary — copy URLs for products</p>
    </div>
    <span class="text-xs text-cream/30">{{ $media->total() }} files total</span>
</div>

{{-- UPLOAD ZONE --}}
<div class="glass rounded-2xl p-6 mb-6 border border-gold/20"
     x-data="{
        dragging: false,
        uploading: false,
        results: [],
        handleDrop(e) {
            this.dragging = false;
            if (e.dataTransfer.files.length) this.uploadFiles(e.dataTransfer.files);
        },
        handleSelect(e) {
            if (e.target.files.length) this.uploadFiles(e.target.files);
        },
        async uploadFiles(files) {
            this.uploading = true;
            this.results   = [];
            const allFiles  = Array.from(files).filter(f => f.type.match(/^(image|video)\//));
            const chunkSize = 20;
            let totalUploaded = 0, totalFailed = 0;
            for (let i = 0; i < allFiles.length; i += chunkSize) {
                const chunk = allFiles.slice(i, i + chunkSize);
                const form  = new FormData();
                for (const f of chunk) form.append('files[]', f);
                form.append('_token', document.querySelector('meta[name=csrf-token]').content);
                try {
                    const res  = await fetch('/admin/media-library/upload', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: form
                    });
                    const data = await res.json();
                    totalUploaded += data.uploaded || 0;
                    totalFailed   += data.failed   || 0;
                } catch(err) {
                    totalFailed += chunk.length;
                }
            }
            this.results = { success: totalUploaded > 0, uploaded: totalUploaded, failed: totalFailed };
            if (totalUploaded > 0) setTimeout(() => window.location.reload(), 1200);
            this.uploading = false;
        }
     }">

    <div @dragover.prevent="dragging = true"
         @dragleave.prevent="dragging = false"
         @drop.prevent="handleDrop($event)"
         @click="$refs.fi.click()"
         :class="dragging ? 'border-gold bg-gold/10' : 'border-gold/25 hover:border-gold/50 hover:bg-white/[0.03]'"
         class="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none">

        <input type="file" x-ref="fi" multiple accept="image/*,video/*" @change="handleSelect($event)" class="hidden">
        <input type="file" x-ref="fid" multiple webkitdirectory @change="handleSelect($event)" class="hidden">

        <template x-if="!uploading">
            <div>
                <div class="text-4xl mb-3">📁</div>
                <p class="text-cream font-semibold text-lg">Drop files here or click to browse</p>
                <p class="text-cream/40 text-sm mt-1">JPG · PNG · GIF · WEBP · MP4 · MOV · WEBM &nbsp;|&nbsp; Max 100MB · Up to 20 files</p>
                <div class="mt-4 flex items-center justify-center gap-3">
                    <button type="button"
                        @click.stop="$refs.fi.click()"
                        class="px-5 py-2 rounded-lg text-sm font-semibold border border-gold/40 text-gold hover:bg-gold/10 transition">
                        📄 Select Files
                    </button>
                    <button type="button"
                        @click.stop="$refs.fid.click()"
                        class="px-5 py-2 rounded-lg text-sm font-semibold border border-gold/40 text-gold hover:bg-gold/10 transition">
                        📂 Upload Folder
                    </button>
                </div>
            </div>
        </template>
        <template x-if="uploading">
            <div class="py-2">
                <div class="inline-block w-10 h-10 border-4 border-gold border-t-transparent rounded-full mb-3" style="animation: spin 0.8s linear infinite"></div>
                <p class="text-gold font-semibold">Uploading to Cloudinary…</p>
                <p class="text-cream/40 text-sm mt-1">Please wait, do not close this page</p>
            </div>
        </template>
    </div>

    <template x-if="results.uploaded !== undefined">
        <div class="mt-3">
            <div :class="results.success ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'"
                 class="rounded-lg border px-4 py-2 text-sm">
                <span x-show="results.success">✓ <span x-text="results.uploaded"></span> file(s) uploaded!
                    <span x-show="results.failed > 0" class="text-yellow-400 ml-2">(<span x-text="results.failed"></span> skipped)</span>
                </span>
                <span x-show="!results.success">Upload failed. Please try again.</span>
            </div>
        </div>
    </template>
</div>

{{-- FILTER --}}
<div class="glass rounded-xl p-4 mb-6">
    <form method="GET" class="flex gap-3 flex-wrap items-center">
        <select name="type" class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm outline-none">
            <option value="" class="bg-ink">All Types</option>
            <option value="image" {{ request('type') === 'image' ? 'selected' : '' }} class="bg-ink">Images Only</option>
            <option value="video" {{ request('type') === 'video' ? 'selected' : '' }} class="bg-ink">Videos Only</option>
        </select>
        <select name="category_id" class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm outline-none">
            <option value="" class="bg-ink">All Categories</option>
            @foreach($categories as $category)
                <option value="{{ $category->id }}" {{ (string) request('category_id') === (string) $category->id ? 'selected' : '' }} class="bg-ink">{{ $category->name }}</option>
            @endforeach
        </select>
        <button type="submit" class="px-4 py-2 bg-gold/20 text-gold rounded-lg text-sm font-semibold hover:bg-gold/30 transition">Filter</button>
        @if(request('type') || request('category_id'))
            <a href="/admin/media-library" class="px-4 py-2 border border-gold/20 text-cream/50 rounded-lg text-sm hover:text-gold transition">Clear</a>
        @endif
    </form>
</div>

{{-- GRID --}}
@if($media->count())
    <div x-data="{
        copied: null,
        selectedIds: [],
        pageIds: @json($media->pluck('id')->values()),
        bulkDeleting: false,
        allSelected() {
            return this.pageIds.length > 0 && this.pageIds.every((id) => this.selectedIds.includes(id));
        },
        toggleSelect(id) {
            if (this.selectedIds.includes(id)) {
                this.selectedIds = this.selectedIds.filter((v) => v !== id);
                return;
            }
            this.selectedIds.push(id);
        },
        toggleSelectAll() {
            if (this.allSelected()) {
                this.selectedIds = [];
                return;
            }
            this.selectedIds = [...this.pageIds];
        },
        async bulkDelete() {
            if (!this.selectedIds.length) return;
            if (!confirm(`Delete ${this.selectedIds.length} selected file(s)?`)) return;

            this.bulkDeleting = true;
            const form = document.getElementById('bulkDeleteForm');
            form.submit();
        },
        async editCaption(id, currentCaption) {
            const nextCaption = prompt('Update caption:', currentCaption || '');
            if (nextCaption === null) return;

            try {
                const res = await fetch(`/admin/media-library/${id}/caption`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content,
                    },
                    body: JSON.stringify({ caption: nextCaption }),
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error('Failed');
                }

                window.location.reload();
            } catch (e) {
                alert('Caption update failed. Please try again.');
            }
        }
    }">
        <div class="glass rounded-xl p-3 mb-4 flex flex-wrap items-center gap-2">
            <button type="button"
                @click="toggleSelectAll()"
                class="px-3 py-2 rounded-lg border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition">
                <span x-show="!allSelected()">Select All (Page)</span>
                <span x-show="allSelected()">Unselect All</span>
            </button>

            <form id="bulkDeleteForm" method="POST" action="/admin/media-library" class="contents">
                @csrf
                @method('DELETE')
                <template x-for="id in selectedIds" :key="id">
                    <input type="hidden" name="ids[]" :value="id">
                </template>
                <button type="button"
                    :disabled="selectedIds.length === 0 || bulkDeleting"
                    @click="bulkDelete()"
                    class="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 text-xs font-semibold hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <span x-show="!bulkDeleting">Delete Selected (<span x-text="selectedIds.length"></span>)</span>
                    <span x-show="bulkDeleting">Deleting...</span>
                </button>
            </form>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        @foreach($media as $item)
            <div class="glass rounded-xl overflow-hidden group relative">
                <div class="aspect-square bg-white/5 relative overflow-hidden">
                    <button type="button"
                        @click.stop="toggleSelect({{ $item->id }})"
                        class="absolute top-2 right-2 z-10 w-6 h-6 rounded border border-white/40 flex items-center justify-center text-[10px] font-bold transition"
                        :class="selectedIds.includes({{ $item->id }}) ? 'bg-gold text-ink border-gold' : 'bg-black/60 text-white'">
                        <span x-show="selectedIds.includes({{ $item->id }})">✓</span>
                        <span x-show="!selectedIds.includes({{ $item->id }})"></span>
                    </button>

                    @if($item->cloudinary_url)
                        @if($item->type === 'video')
                            <video src="{{ $item->cloudinary_url }}" class="w-full h-full object-cover" muted preload="metadata"></video>
                            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div class="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center">
                                    <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                        @else
                            <img src="{{ $item->cloudinary_url }}" alt="{{ $item->caption }}" class="w-full h-full object-cover">
                        @endif
                    @else
                        <div class="w-full h-full flex items-center justify-center text-cream/20 text-xs">No Preview</div>
                    @endif

                    <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase {{ $item->type === 'video' ? 'bg-purple-500/90 text-white' : 'bg-gold/90 text-ink' }}">
                        {{ $item->type }}
                    </span>

                    <div class="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                        @if($item->cloudinary_url)
                            <button @click.stop="
                                navigator.clipboard.writeText('{{ $item->cloudinary_url }}');
                                copied = {{ $item->id }};
                                setTimeout(() => copied = null, 2500);"
                                class="w-full py-2 rounded text-xs font-bold transition"
                                :class="copied === {{ $item->id }} ? 'bg-green-500 text-white' : 'bg-gold text-ink hover:bg-gold-light'">
                                <span x-show="copied !== {{ $item->id }}">📋 Copy URL</span>
                                <span x-show="copied === {{ $item->id }}">✓ Copied!</span>
                            </button>
                            <a href="{{ $item->cloudinary_url }}" target="_blank"
                               class="w-full py-1.5 rounded text-xs font-semibold text-center border border-white/30 text-white hover:bg-white/10 transition">
                                Open Full Size
                            </a>
                            <button type="button"
                                @click.stop="editCaption({{ $item->id }}, @js($item->caption))"
                                class="w-full py-1.5 rounded text-xs font-semibold text-center border border-gold/40 text-gold hover:bg-gold/10 transition">
                                Edit Caption
                            </button>
                        @endif
                        <form method="POST" action="/admin/media-library/{{ $item->id }}" onsubmit="return confirm('Delete?')">
                            @csrf @method('DELETE')
                            <button class="px-5 py-1.5 rounded text-xs border border-red-500/40 text-red-400 hover:bg-red-500/10 transition">Delete</button>
                        </form>
                    </div>
                </div>

                <div class="p-2.5">
                        <form method="POST" action="/admin/media-library/{{ $item->id }}/category" class="mb-2 flex items-center gap-2">
                            @csrf
                            @method('PATCH')
                            <select name="category_id" class="w-full px-2 py-1.5 bg-white/5 border border-gold/20 rounded text-[11px] text-cream outline-none">
                                <option value="" class="bg-ink">No Category</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}" {{ (int) ($item->category_id ?? 0) === (int) $category->id ? 'selected' : '' }} class="bg-ink">{{ $category->name }}</option>
                                @endforeach
                            </select>
                            <button class="px-2 py-1.5 rounded text-[10px] border border-gold/30 text-gold hover:bg-gold/10 transition">Save</button>
                        </form>
                    <p class="text-[11px] text-cream/70 truncate font-medium" title="{{ $item->caption }}">{{ $item->caption ?: '—' }}</p>
                    <p class="text-[10px] text-cream/30 mt-0.5">{{ optional($item->created_at)->format('d M Y, H:i') }}</p>
                </div>
            </div>
        @endforeach
        </div>
    </div>
    <div class="mt-6">{{ $media->links() }}</div>
@else
    <div class="glass rounded-2xl p-16 text-center">
        <div class="text-5xl mb-4">🖼️</div>
        <p class="text-cream/50 text-lg mb-1">No media uploaded yet</p>
        <p class="text-cream/30 text-sm">Drop files above to get started.</p>
    </div>
@endif

@push('scripts')
<style>
    [x-cloak]{display:none!important}
    @keyframes spin{to{transform:rotate(360deg)}}
</style>
@endpush
@endsection
