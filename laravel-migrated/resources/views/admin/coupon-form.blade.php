@extends('layouts.admin')
@section('title', ($coupon ? 'Edit' : 'Create') . ' Coupon – Admin')

@section('content')
<div class="flex items-center gap-3 mb-6">
    <a href="/admin/coupons" class="text-cream/50 hover:text-gold transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
    </a>
    <h1 class="text-2xl font-bold">{{ $coupon ? 'Edit Coupon' : 'Create Coupon' }}</h1>
</div>

<form method="POST" action="{{ $coupon ? '/admin/coupons/' . $coupon->id : '/admin/coupons' }}" class="max-w-2xl">
    @csrf
    @if($coupon) @method('PUT') @endif

    <div class="glass rounded-xl p-6 space-y-5">
        {{-- Code --}}
        <div>
            <label class="block text-sm font-medium text-cream/70 mb-1">Coupon Code <span class="text-red-400">*</span></label>
            <input type="text" name="code" value="{{ old('code', $coupon->code ?? '') }}" required
                class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition uppercase"
                placeholder="e.g. SUMMER20">
            @error('code') <p class="text-red-400 text-xs mt-1">{{ $message }}</p> @enderror
        </div>

        {{-- Description --}}
        <div>
            <label class="block text-sm font-medium text-cream/70 mb-1">Description</label>
            <input type="text" name="description" value="{{ old('description', $coupon->description ?? '') }}"
                class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition"
                placeholder="e.g. Summer sale 20% discount">
        </div>

        {{-- Type & Value --}}
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-cream/70 mb-1">Discount Type <span class="text-red-400">*</span></label>
                <select name="type" required class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
                    <option value="percentage" {{ old('type', $coupon->type ?? '') === 'percentage' ? 'selected' : '' }} class="bg-ink">Percentage (%)</option>
                    <option value="fixed" {{ old('type', $coupon->type ?? '') === 'fixed' ? 'selected' : '' }} class="bg-ink">Fixed Amount (Rs.)</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-cream/70 mb-1">Value <span class="text-red-400">*</span></label>
                <input type="number" name="value" value="{{ old('value', $coupon->value ?? '') }}" required min="0" step="0.01"
                    class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition"
                    placeholder="e.g. 20">
                @error('value') <p class="text-red-400 text-xs mt-1">{{ $message }}</p> @enderror
            </div>
        </div>

        {{-- Min Order & Max Uses --}}
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-cream/70 mb-1">Minimum Order Amount</label>
                <input type="number" name="min_order" value="{{ old('min_order', $coupon->min_order ?? 0) }}" min="0"
                    class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition"
                    placeholder="0 for no minimum">
            </div>
            <div>
                <label class="block text-sm font-medium text-cream/70 mb-1">Max Uses</label>
                <input type="number" name="max_uses" value="{{ old('max_uses', $coupon->max_uses ?? '') }}" min="1"
                    class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition"
                    placeholder="Leave empty for unlimited">
            </div>
        </div>

        {{-- Valid Dates --}}
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-cream/70 mb-1">Valid From</label>
                <input type="date" name="valid_from" value="{{ old('valid_from', $coupon->valid_from ? \Carbon\Carbon::parse($coupon->valid_from)->format('Y-m-d') : '') }}"
                    class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
            </div>
            <div>
                <label class="block text-sm font-medium text-cream/70 mb-1">Valid Until</label>
                <input type="date" name="valid_until" value="{{ old('valid_until', $coupon->valid_until ? \Carbon\Carbon::parse($coupon->valid_until)->format('Y-m-d') : '') }}"
                    class="w-full px-4 py-2.5 bg-white/5 border border-gold/20 rounded-lg text-cream text-sm focus:border-gold outline-none transition">
            </div>
        </div>

        {{-- Active Toggle --}}
        <div class="flex items-center gap-3">
            <input type="hidden" name="is_active" value="0">
            <input type="checkbox" name="is_active" value="1" id="is_active"
                {{ old('is_active', $coupon->is_active ?? true) ? 'checked' : '' }}
                class="w-4 h-4 accent-gold">
            <label for="is_active" class="text-sm text-cream/70">Active (coupon can be used by customers)</label>
        </div>
    </div>

    {{-- Actions --}}
    <div class="flex items-center gap-3 mt-6">
        <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-lg text-sm tracking-wider uppercase">
            {{ $coupon ? 'Update Coupon' : 'Create Coupon' }}
        </button>
        <a href="/admin/coupons" class="px-5 py-2.5 border border-gold/20 text-cream/60 rounded-lg text-sm hover:text-gold transition">Cancel</a>
    </div>
</form>
@endsection