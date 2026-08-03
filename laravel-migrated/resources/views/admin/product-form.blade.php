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
                @isset($categories)
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}" {{ old('category_id', $product->category_id ?? '') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                    @endforeach
                @endisset
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

    <div class="glass rounded-xl p-6 space-y-5" x-data="productImageUploader()">
        <h3 class="text-lg font-semibold">Media Gallery</h3>
        <div class="flex items-center justify-between gap-3 flex-wrap">
            <p class="text-xs text-cream/40">Enter image or video URLs, one per line</p>
            <div class="flex items-center gap-2">
                <button type="button"
                    @click="openLibrary()"
                    class="px-3 py-1.5 rounded-lg border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition">
                    Select From Media Library
                </button>
                <button type="button"
                    @click="$refs.productImagesInput.click()"
                    :disabled="uploading"
                    class="px-3 py-1.5 rounded-lg border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition disabled:opacity-60 disabled:cursor-not-allowed">
                    <span x-show="!uploading">Upload Images From Laptop</span>
                    <span x-show="uploading">Uploading...</span>
                </button>
            </div>
        </div>
        <input type="file" x-ref="productImagesInput" accept="image/*,video/*" multiple class="hidden" @change="uploadProductImages($event)">
        @php
            $imgs = old('images', isset($product) ? (is_string($product->images) ? implode("\n", json_decode($product->images, true) ?? []) : implode("\n", $product->images ?? [])) : '');
        @endphp
        <textarea name="images" x-ref="imagesTextarea" rows="4"
            class="w-full px-4 py-3 bg-white/5 border border-gold/20 rounded-lg text-cream focus:border-gold outline-none transition resize-none font-mono text-xs"
            placeholder="https://res.cloudinary.com/...">{{ $imgs }}</textarea>
        <p x-show="uploadMessage" x-text="uploadMessage" class="text-xs text-cream/70"></p>
        <p class="text-[11px] text-cream/35">Tip: videos can also be attached here and will show on the product gallery.</p>

        <div x-show="libraryOpen" x-cloak class="fixed inset-0 z-[120] bg-black/70 p-4 flex items-center justify-center" @click.self="libraryOpen = false">
            <div class="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-xl border border-gold/20 bg-ink">
                <div class="flex items-center justify-between px-4 py-3 border-b border-gold/10">
                    <h4 class="text-sm font-semibold">Select Media Library Images</h4>
                    <button type="button" @click="libraryOpen = false" class="text-cream/70 hover:text-gold">Close</button>
                </div>
                <div class="p-4 border-b border-gold/10 flex items-center gap-2">
                    <select x-model="libraryType" @change="fetchLibraryItems()" class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-xs outline-none">
                        <option value="">All Media</option>
                        <option value="image">Images</option>
                        <option value="video">Videos</option>
                    </select>
                    <select x-model="libraryCategoryId" @change="fetchLibraryItems()" class="px-3 py-2 bg-white/5 border border-gold/20 rounded-lg text-cream text-xs outline-none">
                        <option value="">All Categories</option>
                        @isset($categories)
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        @endisset
                    </select>
                    <button type="button" @click="fetchLibraryItems()" class="px-3 py-2 rounded-lg border border-gold/30 text-gold text-xs hover:bg-gold/10 transition">Refresh</button>
                    <button type="button" @click="appendSelectedLibraryUrls()" class="ml-auto px-3 py-2 rounded-lg border border-gold/30 text-gold text-xs hover:bg-gold/10 transition">Add Selected URLs</button>
                </div>
                <div class="p-4 overflow-y-auto max-h-[65vh]">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        <template x-for="item in libraryItems" :key="item.id">
                            <label class="relative block rounded-lg overflow-hidden border border-gold/20 cursor-pointer">
                                <template x-if="item.type === 'video'">
                                    <div class="relative">
                                        <video :src="item.cloudinary_url" class="w-full aspect-square object-cover bg-black" muted preload="metadata"></video>
                                        <div class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                            <div class="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white text-xs">Play</div>
                                        </div>
                                    </div>
                                </template>
                                <template x-if="item.type !== 'video'">
                                    <img :src="item.cloudinary_url" :alt="item.caption || 'media'" class="w-full aspect-square object-cover">
                                </template>
                                <input type="checkbox" class="absolute top-2 left-2" :value="item.id" @change="toggleLibrarySelect(item)">
                                <div class="p-2 bg-ink/80 text-[10px] text-cream/70 truncate">
                                    <span x-text="item.caption || item.cloudinary_public_id"></span>
                                    <span class="ml-1 text-gold/70 uppercase" x-text="item.type"></span>
                                </div>
                            </label>
                        </template>
                    </div>
                </div>
            </div>
        </div>
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

@push('scripts')
<script>
function productImageUploader() {
    return {
        uploading: false,
        uploadMessage: '',
        libraryOpen: false,
        libraryItems: [],
        selectedLibraryItems: [],
        libraryCategoryId: '',
        libraryType: '',
        openLibrary() {
            this.libraryOpen = true;
            this.fetchLibraryItems();
        },
        async fetchLibraryItems() {
            const params = new URLSearchParams();
            if (this.libraryType) {
                params.set('type', this.libraryType);
            }
            if (this.libraryCategoryId) {
                params.set('category_id', this.libraryCategoryId);
            }

            const res = await fetch('/admin/media-library/list?' + params.toString(), {
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            this.libraryItems = data.items || [];
            this.selectedLibraryItems = [];
        },
        toggleLibrarySelect(item) {
            const exists = this.selectedLibraryItems.find((x) => x.id === item.id);
            if (exists) {
                this.selectedLibraryItems = this.selectedLibraryItems.filter((x) => x.id !== item.id);
                return;
            }
            this.selectedLibraryItems.push(item);
        },
        appendSelectedLibraryUrls() {
            const urls = this.selectedLibraryItems
                .map((item) => item.cloudinary_url)
                .filter(Boolean);

            if (!urls.length) {
                this.uploadMessage = 'Select at least one media item.';
                return;
            }

            const current = (this.$refs.imagesTextarea.value || '').trim();
            const existing = current ? current.split(/\r?\n/).map((v) => v.trim()).filter(Boolean) : [];
            const merged = [...new Set([...existing, ...urls])];
            this.$refs.imagesTextarea.value = merged.join('\n');
            this.uploadMessage = `${urls.length} image(s) added from media library.`;
            this.libraryOpen = false;
        },
        appendUrlsToTextarea(urls) {
            const current = (this.$refs.imagesTextarea.value || '').trim();
            const existing = current ? current.split(/\r?\n/).map((v) => v.trim()).filter(Boolean) : [];
            const merged = [...new Set([...existing, ...urls])];
            this.$refs.imagesTextarea.value = merged.join('\n');
        },
        extractUploadUrls(data) {
            const urls = [];

            const addUrl = (value) => {
                if (typeof value !== 'string') return;
                const trimmed = value.trim();
                if (!trimmed) return;
                urls.push(trimmed);
            };

            const collections = [data?.items, data?.media, data?.files].filter(Array.isArray);
            collections.forEach((list) => {
                list.forEach((item) => {
                    if (typeof item === 'string') {
                        addUrl(item);
                        return;
                    }

                    addUrl(item?.url);
                    addUrl(item?.cloudinary_url);
                    addUrl(item?.secure_url);
                    addUrl(item?.media_url);
                });
            });

            addUrl(data?.url);
            addUrl(data?.cloudinary_url);
            addUrl(data?.secure_url);

            return [...new Set(urls)];
        },
        async fetchRecentUploadedUrls(limit = 1) {
            const res = await fetch('/admin/media-library/list', {
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            const items = Array.isArray(data?.items) ? data.items : [];

            return items
                .slice(0, Math.max(1, Number(limit) || 1))
                .map((item) => item?.cloudinary_url || item?.url || item?.secure_url || item?.media_url)
                .filter((url) => typeof url === 'string' && url.trim() !== '');
        },
        async uploadProductImages(event) {
            const files = Array.from(event.target.files || []);
            if (!files.length) return;

            const validFiles = files.filter((f) => {
                const type = f.type || '';
                return type.startsWith('image/') || type.startsWith('video/');
            });
            if (!validFiles.length) {
                this.uploadMessage = 'Please select image or video files only.';
                event.target.value = '';
                return;
            }

            this.uploading = true;
            this.uploadMessage = '';

            const form = new FormData();
            validFiles.forEach((file) => form.append('files[]', file));
            form.append('_token', document.querySelector('meta[name=csrf-token]').content);

            try {
                const res = await fetch('/admin/media-library/upload', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: form,
                });
                let data = {};
                try {
                    data = await res.json();
                } catch (parseError) {
                    data = {};
                }

                if (!res.ok) {
                    throw new Error(data?.message || 'Upload request failed.');
                }

                let urls = this.extractUploadUrls(data);
                const uploadedCount = Number(data?.uploaded || 0);

                if (!urls.length && uploadedCount > 0) {
                    urls = await this.fetchRecentUploadedUrls(uploadedCount);
                }

                if (urls.length) {
                    this.appendUrlsToTextarea(urls);
                    this.uploadMessage = `${urls.length} media item(s) uploaded and added.`;
                } else if (uploadedCount > 0) {
                    this.uploadMessage = 'Upload successful. URL auto-add miss ho gaya, Select From Media Library se image select karein.';
                } else {
                    this.uploadMessage = data?.message || 'Upload completed but no media URL returned.';
                }
            } catch (error) {
                this.uploadMessage = 'Upload failed. Please try again.';
            } finally {
                this.uploading = false;
                event.target.value = '';
            }
        }
    }
}
</script>
@endpush
@endsection
