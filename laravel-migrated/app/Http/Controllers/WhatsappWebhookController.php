<?php

namespace App\Http\Controllers;

use App\Models\WhatsappMedia;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappWebhookController extends Controller
{
    /**
     * Twilio calls this when a WhatsApp message arrives on your number.
     * Add this URL in Twilio console → Messaging → WhatsApp Sandbox
     * or your number settings → "A MESSAGE COMES IN" webhook.
     *
     * URL: POST /api/whatsapp/webhook
     */
    public function receive(Request $request): Response
    {
        try {
            $from       = (string) $request->input('From', '');
            $numMedia   = (int)    $request->input('NumMedia', 0);
            $body       = (string) $request->input('Body', '');

            if ($numMedia === 0) {
                // Text-only message – ignore
                return response('', 204);
            }

            for ($i = 0; $i < $numMedia; $i++) {
                $mediaUrl         = (string) $request->input("MediaUrl{$i}", '');
                $mediaContentType = (string) $request->input("MediaContentType{$i}", '');

                if (empty($mediaUrl)) {
                    continue;
                }

                $type = str_starts_with($mediaContentType, 'video') ? 'video' : 'image';

                // Download media from Twilio (requires Twilio auth)
                $twilioSid    = env('TWILIO_ACCOUNT_SID', '');
                $twilioToken  = env('TWILIO_AUTH_TOKEN', '');

                $mediaResponse = Http::withBasicAuth($twilioSid, $twilioToken)
                    ->timeout(60)
                    ->get($mediaUrl);

                if (!$mediaResponse->successful()) {
                    Log::warning("WhatsApp webhook: failed to download media from {$mediaUrl}");
                    continue;
                }

                // Upload to Cloudinary
                $cloudinaryResult = $this->uploadToCloudinary(
                    $mediaResponse->body(),
                    $type,
                    $mediaContentType
                );

                WhatsappMedia::create([
                    'from_number'             => $from,
                    'media_url'               => $mediaUrl,
                    'cloudinary_url'          => $cloudinaryResult['url'] ?? null,
                    'cloudinary_public_id'    => $cloudinaryResult['public_id'] ?? null,
                    'type'                    => $type,
                    'caption'                 => $body ?: null,
                    'uploaded_to_cloudinary'  => !empty($cloudinaryResult['url']),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('WhatsApp webhook error: ' . $e->getMessage());
        }

        // Twilio expects a TwiML response (can be empty)
        return response(
            '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            200,
            ['Content-Type' => 'text/xml']
        );
    }

    /**
     * Upload raw bytes to Cloudinary via Upload API.
     */
    private function uploadToCloudinary(string $fileBytes, string $type, string $mimeType): array
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME', '');
        $apiKey    = env('CLOUDINARY_API_KEY', '');
        $apiSecret = env('CLOUDINARY_API_SECRET', '');

        if (empty($cloudName) || empty($apiKey) || empty($apiSecret)) {
            return [];
        }

        $timestamp = time();
        $folder    = 'whatsapp-uploads';
        $signature = sha1("folder={$folder}&timestamp={$timestamp}{$apiSecret}");

        // Write to temp file
        $tmpFile = tempnam(sys_get_temp_dir(), 'wa_media_');
        file_put_contents($tmpFile, $fileBytes);

        $resourceType = ($type === 'video') ? 'video' : 'image';
        $url = "https://api.cloudinary.com/v1_1/{$cloudName}/{$resourceType}/upload";

        $response = Http::timeout(120)
            ->attach('file', fopen($tmpFile, 'r'), 'media.' . $this->extFromMime($mimeType))
            ->post($url, [
                'api_key'   => $apiKey,
                'timestamp' => $timestamp,
                'folder'    => $folder,
                'signature' => $signature,
            ]);

        @unlink($tmpFile);

        if ($response->successful()) {
            $data = $response->json();
            return [
                'url'       => $data['secure_url'] ?? '',
                'public_id' => $data['public_id'] ?? '',
            ];
        }

        Log::warning('Cloudinary upload failed: ' . $response->body());
        return [];
    }

    private function extFromMime(string $mime): string
    {
        return match (true) {
            str_contains($mime, 'jpeg') => 'jpg',
            str_contains($mime, 'png')  => 'png',
            str_contains($mime, 'gif')  => 'gif',
            str_contains($mime, 'webp') => 'webp',
            str_contains($mime, 'mp4')  => 'mp4',
            str_contains($mime, 'ogg')  => 'ogg',
            str_contains($mime, '3gpp') => '3gp',
            default                     => 'bin',
        };
    }
}
