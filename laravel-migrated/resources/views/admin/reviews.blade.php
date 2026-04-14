@extends('layouts.admin')
@section('title', 'Reviews – Admin')

@section('content')
<h1 class="text-2xl font-bold mb-6">Reviews</h1>

<div class="glass rounded-xl overflow-hidden">
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gold/10 text-cream/50 text-left">
                    <th class="p-4 font-medium">Product</th>
                    <th class="p-4 font-medium">Customer</th>
                    <th class="p-4 font-medium">Rating</th>
                    <th class="p-4 font-medium">Comment</th>
                    <th class="p-4 font-medium">Status</th>
                    <th class="p-4 font-medium">Date</th>
                    <th class="p-4 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gold/5">
                @forelse($reviews as $review)
                    <tr class="hover:bg-white/5 transition">
                        <td class="p-4 font-medium">{{ $review->product->name ?? 'Deleted' }}</td>
                        <td class="p-4 text-cream/60">{{ $review->user->first_name ?? $review->customer_name ?? 'Anonymous' }}</td>
                        <td class="p-4">
                            <div class="flex gap-0.5">
                                @for($i = 1; $i <= 5; $i++)
                                    <svg class="w-3.5 h-3.5 {{ $i <= $review->rating ? 'text-gold' : 'text-cream/20' }}" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                @endfor
                            </div>
                        </td>
                        <td class="p-4 text-cream/60 max-w-xs truncate">{{ $review->comment ?? '—' }}</td>
                        <td class="p-4">
                            <span class="px-2 py-0.5 rounded-full text-xs {{ ($review->is_approved ?? false) ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400' }}">
                                {{ ($review->is_approved ?? false) ? 'Approved' : 'Pending' }}
                            </span>
                        </td>
                        <td class="p-4 text-cream/50">{{ $review->created_at->format('d M Y') }}</td>
                        <td class="p-4">
                            <div class="flex gap-2">
                                <form method="POST" action="/admin/reviews/{{ $review->id }}/toggle">
                                    @csrf @method('PATCH')
                                    <button class="px-3 py-1 border border-gold/30 text-gold rounded text-xs hover:bg-gold/10 transition">
                                        {{ ($review->is_approved ?? false) ? 'Hide' : 'Approve' }}
                                    </button>
                                </form>
                                <form method="POST" action="/admin/reviews/{{ $review->id }}" onsubmit="return confirm('Delete this review?')">
                                    @csrf @method('DELETE')
                                    <button class="px-3 py-1 border border-red-500/30 text-red-400 rounded text-xs hover:bg-red-500/10 transition">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="7" class="p-8 text-center text-cream/40">No reviews found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@if(method_exists($reviews, 'links'))
    <div class="mt-6">{{ $reviews->links() }}</div>
@endif
@endsection
