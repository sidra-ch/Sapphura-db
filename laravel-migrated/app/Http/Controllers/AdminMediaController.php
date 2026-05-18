<?php

namespace App\Http\Controllers;

use App\Models\WhatsappMedia;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminMediaController extends Controller
{
    public function index(Request $request)
    {
        $query = WhatsappMedia::latest();

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        $media = $query->paginate(24)->withQueryString();

        return view('admin.media-library', compact('media'));
    }

    public function upload(Request $request)
    {
        $request->validate([
            'files'   => 'required|array|min:1|max:50',
            'files.*' => 'file|mimetypes:image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm|max:102400',
        ]);

        $uploaded = 0;
        $failed   = 0;

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
            } catch (\Throwable $e) {
                Log::error('Media upload failed: ' . $e->getMessage());
                $failed++;
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success'  => $uploaded > 0,
                'uploaded' => $uploaded,
                'failed'   => $failed,
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
        WhatsappMedia::findOrFail($id)->delete();
        return back()->with('success', 'Media deleted.');
    }
}
