<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\WhatsappMedia;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminMediaController extends Controller
{
    public function index(Request $request)
    {
        $query = WhatsappMedia::query()->with('category')->latest('created_at');

        if ($request->filled('type')) {
            $query->where('type', '=', $request->input('type'), 'and');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', '=', $request->input('category_id'), 'and');
        }

        $media = $query->paginate(24)->withQueryString();
        $categories = Category::query()->orderBy('name', 'asc')->get();

        return view('admin.media-library', compact('media', 'categories'));
    }

    public function list(Request $request)
    {
        $query = WhatsappMedia::query()->latest('created_at');

        if ($request->filled('type')) {
            $query->where('type', '=', $request->input('type'), 'and');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', '=', $request->input('category_id'), 'and');
        }

        $items = $query->limit(120)->get([
            'id',
            'cloudinary_url',
            'cloudinary_public_id',
            'type',
            'caption',
            'category_id',
            'created_at',
        ]);

        return response()->json([
            'success' => true,
            'items' => $items,
        ]);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'files'   => 'required|array|min:1|max:50',
            'files.*' => 'file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm|max:102400',
        ]);

        $uploaded = 0;
        $failed   = 0;
        $items    = [];

        foreach ($request->file('files') as $file) {
            try {
                $result = CloudinaryService::uploadFile($file, 'admin-uploads');

                WhatsappMedia::create([
                    'from_number'            => 'admin',
                    'media_url'              => $result['url'],
                    'cloudinary_url'         => $result['url'],
                    'cloudinary_public_id'   => $result['public_id'],
                    'type'                   => $result['resource_type'],
                    'caption'                => $file->getClientOriginalName(),
                    'uploaded_to_cloudinary' => true,
                ]);

                $uploaded++;
                $items[] = [
                    'url' => $result['url'],
                    'public_id' => $result['public_id'],
                    'type' => $result['resource_type'],
                    'name' => $file->getClientOriginalName(),
                ];
            } catch (\Throwable $e) {
                Log::error('Media upload failed: ' . $e->getMessage());
                $failed++;
            }
        }

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success'  => $uploaded > 0,
                'uploaded' => $uploaded,
                'failed'   => $failed,
                'items'    => $items,
            ]);
        }

        $msg = "{$uploaded} file(s) uploaded successfully.";
        if ($failed > 0) {
            $msg .= " {$failed} failed.";
        }

        return back()->with($uploaded > 0 ? 'success' : 'error', $msg);
    }

    public function destroy(int $id)
    {
        $item = WhatsappMedia::query()->findOrFail($id, ['*']);
        $cloudDeleted = $this->deleteFromCloudinary($item);

        $item->delete([]);

        if ($cloudDeleted === false) {
            return back()->with('error', 'Media removed from panel, but Cloudinary deletion failed.');
        }

        return back()->with('success', 'Media deleted.');
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1|max:200',
            'ids.*' => 'integer|exists:whatsapp_media,id',
        ]);

        $allMedia = WhatsappMedia::query()
            ->get(['id', 'from_number', 'media_url', 'cloudinary_url', 'cloudinary_public_id', 'type', 'caption', 'category_id', 'uploaded_to_cloudinary', 'created_at', 'updated_at'])
            ->keyBy('id');
        $items = collect();
        foreach ($validated['ids'] as $mediaId) {
            $item = $allMedia->get((int) $mediaId);
            if ($item) {
                $items->push($item);
            }
        }

        $deleted = 0;
        $cloudFailures = 0;

        foreach ($items as $item) {
            $cloudDeleted = $this->deleteFromCloudinary($item);
            if ($cloudDeleted === false) {
                $cloudFailures++;
            }

            $item->delete([]);
            $deleted++;
        }

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => $deleted > 0,
                'deleted' => $deleted,
                'cloud_failures' => $cloudFailures,
            ]);
        }

        $message = "{$deleted} file(s) deleted.";
        if ($cloudFailures > 0) {
            $message .= " {$cloudFailures} Cloudinary delete(s) failed.";
            return back()->with('error', $message);
        }

        return back()->with('success', $message);
    }

    public function updateCaption(Request $request, int $id)
    {
        $validated = $request->validate([
            'caption' => 'nullable|string|max:255',
        ]);

        $item = WhatsappMedia::query()->findOrFail($id, ['*']);
        $item->caption = trim((string) ($validated['caption'] ?? '')) ?: null;
        $item->save();

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'id' => $item->id,
                'caption' => $item->caption,
            ]);
        }

        return back()->with('success', 'Media caption updated.');
    }

    public function updateCategory(Request $request, int $id)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $item = WhatsappMedia::query()->findOrFail($id, ['*']);
        $item->category_id = $validated['category_id'] ?? null;
        $item->save();

        if ($request->wantsJson() || $request->expectsJson()) {
            return response()->json([
                'success' => true,
                'id' => $item->id,
                'category_id' => $item->category_id,
            ]);
        }

        return back()->with('success', 'Media category updated.');
    }

    private function deleteFromCloudinary(WhatsappMedia $item): ?bool
    {
        if (!$item->uploaded_to_cloudinary || empty($item->cloudinary_public_id)) {
            return null;
        }

        try {
            $resourceType = $item->type === 'video' ? 'video' : 'image';
            return CloudinaryService::deleteResource($item->cloudinary_public_id, $resourceType);
        } catch (\Throwable $e) {
            Log::error('Cloudinary delete failed for media ID ' . $item->id . ': ' . $e->getMessage());
            return false;
        }
    }
}
