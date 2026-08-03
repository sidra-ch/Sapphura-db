<?php

declare(strict_types=1);

use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Http\UploadedFile;

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

if (!CloudinaryService::configured()) {
    fwrite(STDERR, "Cloudinary is not configured in .env\n");
    exit(1);
}

$folder = 'products';
$newCloudName = (string) env('CLOUDINARY_CLOUD_NAME', '');

$cache = [];
$updatedProducts = 0;
$uploadedFiles = 0;
$skipped = 0;
$failed = 0;

function normalizeImages(mixed $raw): array
{
    if (is_array($raw)) {
        return array_values(array_filter(array_map('trim', $raw), fn ($v) => $v !== ''));
    }

    $str = trim((string) $raw);
    if ($str === '') {
        return [];
    }

    $decoded = json_decode($str, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        return array_values(array_filter(array_map('trim', $decoded), fn ($v) => $v !== ''));
    }

    return array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', $str) ?: []), fn ($v) => $v !== ''));
}

function isCloudinaryOnCurrentAccount(string $url, string $cloudName): bool
{
    return $cloudName !== '' && str_contains($url, 'res.cloudinary.com/' . $cloudName . '/');
}

function uploadLocalFile(string $absolutePath, string $folder): array
{
    $fileName = basename($absolutePath);
    $uploaded = new UploadedFile($absolutePath, $fileName, null, null, true);
    return CloudinaryService::uploadFile($uploaded, $folder);
}

function uploadRemoteFile(string $url, string $folder): ?array
{
    $data = @file_get_contents($url);
    if ($data === false || $data === '') {
        return null;
    }

    $path = parse_url($url, PHP_URL_PATH);
    $baseName = is_string($path) ? basename($path) : 'remote-asset';
    if ($baseName === '' || $baseName === '.' || $baseName === '/') {
        $baseName = 'remote-asset';
    }

    $tempPath = tempnam(sys_get_temp_dir(), 'cld_');
    if ($tempPath === false) {
        return null;
    }

    $ext = pathinfo($baseName, PATHINFO_EXTENSION);
    if ($ext !== '') {
        $finalTempPath = $tempPath . '.' . $ext;
        @rename($tempPath, $finalTempPath);
        $tempPath = $finalTempPath;
    }

    file_put_contents($tempPath, $data);

    try {
        $uploaded = new UploadedFile($tempPath, $baseName, null, null, true);
        return CloudinaryService::uploadFile($uploaded, $folder);
    } finally {
        @unlink($tempPath);
    }
}

Product::query()->select(['id', 'name', 'images'])->chunkById(50, function ($products) use (&$cache, &$updatedProducts, &$uploadedFiles, &$skipped, &$failed, $folder, $newCloudName) {
    foreach ($products as $product) {
        $images = normalizeImages($product->images);
        if (empty($images)) {
            continue;
        }

        $changed = false;
        $newImages = [];

        foreach ($images as $image) {
            $source = trim((string) $image);
            if ($source === '') {
                continue;
            }

            if (isset($cache[$source])) {
                $newImages[] = $cache[$source];
                $changed = $changed || ($cache[$source] !== $source);
                continue;
            }

            if (isCloudinaryOnCurrentAccount($source, $newCloudName)) {
                $cache[$source] = $source;
                $newImages[] = $source;
                $skipped++;
                continue;
            }

            $uploadedUrl = null;

            if (preg_match('#^https?://#i', $source) === 1) {
                $result = uploadRemoteFile($source, $folder);
                if (is_array($result) && !empty($result['url'])) {
                    $uploadedUrl = (string) $result['url'];
                    $uploadedFiles++;
                }
            } else {
                $relative = ltrim($source, '/\\');
                $absolute = public_path($relative);
                if (is_file($absolute)) {
                    try {
                        $result = uploadLocalFile($absolute, $folder);
                        $uploadedUrl = (string) ($result['url'] ?? '');
                        if ($uploadedUrl !== '') {
                            $uploadedFiles++;
                        }
                    } catch (Throwable $e) {
                        $uploadedUrl = null;
                    }
                }
            }

            if ($uploadedUrl !== null && $uploadedUrl !== '') {
                $cache[$source] = $uploadedUrl;
                $newImages[] = $uploadedUrl;
                $changed = true;
            } else {
                $cache[$source] = $source;
                $newImages[] = $source;
                $failed++;
            }
        }

        if ($changed) {
            Product::query()
                ->where('id', '=', $product->id, 'and')
                ->update(['images' => json_encode(array_values($newImages), JSON_UNESCAPED_SLASHES)]);
            $updatedProducts++;
            echo "Updated product #{$product->id} ({$product->name})\n";
        }
    }
});

echo "\nMigration complete\n";
echo "Products updated: {$updatedProducts}\n";
echo "Assets uploaded: {$uploadedFiles}\n";
echo "Already on current cloud: {$skipped}\n";
echo "Upload failures/unchanged: {$failed}\n";
