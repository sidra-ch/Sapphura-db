<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CloudinaryService
{
    public static function configured(): bool
    {
        return !empty(env('CLOUDINARY_API_KEY')) && !empty(env('CLOUDINARY_API_SECRET'));
    }

    public static function cloudName(): string
    {
        return env('CLOUDINARY_CLOUD_NAME', 'dwmxdyvd2');
    }

    public static function listAssets(?string $prefix = null): array
    {
        if (!self::configured()) {
            throw new \RuntimeException('Cloudinary credentials are not configured');
        }

        $images = self::listAllResources('image', $prefix);
        $videos = self::listAllResources('video', $prefix);

        return ['images' => $images, 'videos' => $videos];
    }

    public static function createUploadSignature(string $folder = 'products'): array
    {
        if (!self::configured()) {
            throw new \RuntimeException('Cloudinary credentials are not configured');
        }

        $timestamp = time();
        $apiSecret = env('CLOUDINARY_API_SECRET');

        $paramsToSign = "folder={$folder}&timestamp={$timestamp}";
        $signature = sha1($paramsToSign . $apiSecret);

        return [
            'cloudName' => self::cloudName(),
            'apiKey' => env('CLOUDINARY_API_KEY'),
            'folder' => $folder,
            'timestamp' => $timestamp,
            'signature' => $signature,
        ];
    }

    public static function uploadFile(\Illuminate\Http\UploadedFile $file, string $folder = 'admin-uploads'): array
    {
        if (!self::configured()) {
            throw new \RuntimeException('Cloudinary credentials are not configured');
        }

        $cloudName = self::cloudName();
        $apiKey    = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');
        $timestamp = time();

        $mimeType     = $file->getMimeType() ?? '';
        $resourceType = str_starts_with($mimeType, 'video') ? 'video' : 'image';

        $paramsToSign = "folder={$folder}&timestamp={$timestamp}";
        $signature    = sha1($paramsToSign . $apiSecret);

        $url = "https://api.cloudinary.com/v1_1/{$cloudName}/{$resourceType}/upload";

        $response = Http::timeout(120)
            ->attach('file', fopen($file->getRealPath(), 'r'), $file->getClientOriginalName())
            ->post($url, [
                'api_key'   => $apiKey,
                'timestamp' => $timestamp,
                'folder'    => $folder,
                'signature' => $signature,
            ]);

        if (!$response->successful()) {
            throw new \RuntimeException('Cloudinary upload failed: ' . $response->body());
        }

        $data = $response->json();
        return [
            'url'           => $data['secure_url'] ?? '',
            'public_id'     => $data['public_id'] ?? '',
            'resource_type' => $resourceType,
            'width'         => $data['width'] ?? null,
            'height'        => $data['height'] ?? null,
            'bytes'         => $data['bytes'] ?? null,
            'format'        => $data['format'] ?? '',
        ];
    }

    private static function listAllResources(string $resourceType, ?string $prefix = null): array
    {
        $resources = [];
        $nextCursor = null;
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');
        $cloudName = self::cloudName();

        do {
            $params = [
                'type' => 'upload',
                'resource_type' => $resourceType,
                'max_results' => 100,
            ];
            if ($prefix) {
                $params['prefix'] = $prefix;
            }
            if ($nextCursor) {
                $params['next_cursor'] = $nextCursor;
            }

            $url = "https://api.cloudinary.com/v1_1/{$cloudName}/resources/{$resourceType}";

            $response = Http::withBasicAuth($apiKey, $apiSecret)
                ->timeout(30)
                ->get($url, $params);

            $data = $response->json() ?? [];
            $resources = array_merge($resources, $data['resources'] ?? []);
            $nextCursor = $data['next_cursor'] ?? null;
        } while ($nextCursor);

        return $resources;
    }
}
