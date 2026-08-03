<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use SimpleXMLElement;
use ZipArchive;

class AdminProductImportController extends Controller
{
    public function showForm(Request $request)
    {
        return view('admin.product-import', [
            'previewRows' => $request->session()->get('product_import_preview_rows', []),
            'summary' => $request->session()->get('product_import_summary', null),
        ]);
    }

    public function downloadTemplate()
    {
        $headers = [
            'name',
            'description',
            'price',
            'sale_price',
            'stock',
            'sku',
            'status',
            'is_featured',
            'category',
            'image_urls',
            'video_urls',
            'image_files',
            'video_files',
        ];

        $sampleRows = [
            [
                'Emerald Luxe 3pc',
                'Premium formal 3 piece suit',
                '8990',
                '7990',
                '12',
                'EMR-3PC-001',
                'active',
                'yes',
                'Luxury',
                'https://example.com/p1-front.jpg|https://example.com/p1-back.jpg',
                'https://example.com/p1-video.mp4',
                '',
                '',
            ],
            [
                'Signature Abaya',
                'Flowy abaya with handwork',
                '6500',
                '',
                '8',
                'ABY-1002',
                'active',
                'no',
                'Abaya',
                '',
                '',
                'import-media/abaya-a1.jpg|import-media/abaya-a2.jpg',
                'import-media/abaya-v1.mp4',
            ],
        ];

        return response()->streamDownload(function () use ($headers, $sampleRows): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            fputcsv($handle, $headers);
            foreach ($sampleRows as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, 'products-import-template.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    public function preview(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimetypes:text/plain,text/csv,text/tsv,application/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|max:10240',
        ]);

        $csv = $request->file('csv_file');
        if (!$csv instanceof UploadedFile) {
            return back()->with('error', 'CSV file upload failed. Please try again.');
        }

        if ($this->isXlsxFile($csv) && !$this->supportsXlsx()) {
            return back()->with('error', 'XLSX import requires the PHP zip extension. Please upload a CSV file or enable zip on the server.');
        }

        [$previewRows, $validRows, $summary] = $this->parseAndValidateFile($csv);

        if (($summary['total_rows'] ?? 0) === 0) {
            return back()->with('error', 'CSV file is empty or invalid.');
        }

        $request->session()->put('product_import_preview_rows', $previewRows);
        $request->session()->put('product_import_valid_rows', $validRows);
        $request->session()->put('product_import_summary', $summary);

        return redirect()->route('admin.products.import.form')->with(
            $summary['valid_rows'] > 0
                ? 'success'
                : 'error',
            $summary['valid_rows'] > 0
                ? 'Preview ready. Please review and click import.'
                : 'Preview generated, but no valid rows found to import.'
        );
    }

    public function commit(Request $request)
    {
        $validRows = $request->session()->get('product_import_valid_rows', []);
        if (!is_array($validRows) || empty($validRows)) {
            return back()->with('error', 'No preview data found. Please upload CSV and preview first.');
        }

        $existingSlugs = Product::withTrashed()->pluck('slug')->all();
        $slugSet = [];
        foreach ($existingSlugs as $slug) {
            if (is_string($slug) && $slug !== '') {
                $slugSet[$slug] = true;
            }
        }

        $created = 0;
        $failed = 0;
        $errors = [];

        foreach ($validRows as $row) {
            try {
                DB::transaction(function () use ($row, &$created, &$slugSet, &$errors): void {
                    $name = (string) ($row['name'] ?? '');
                    $baseSlug = Str::slug($name !== '' ? $name : 'product');
                    if ($baseSlug === '') {
                        $baseSlug = 'product';
                    }

                    $slug = $baseSlug;
                    $counter = 2;
                    while (isset($slugSet[$slug])) {
                        $slug = $baseSlug . '-' . $counter;
                        $counter++;
                    }
                    $slugSet[$slug] = true;

                    $mediaUploadErrors = [];
                    $media = $this->prepareImportMedia((array) ($row['media'] ?? []), $mediaUploadErrors);
                    foreach ($mediaUploadErrors as $mediaError) {
                        $errors[] = 'Row ' . ($row['row_number'] ?? '?') . ': ' . $mediaError;
                    }

                    Product::create([
                        'public_id' => (string) Str::uuid(),
                        'name' => $name,
                        'slug' => $slug,
                        'description' => (string) ($row['description'] ?? $name),
                        'price' => (float) ($row['price'] ?? 0),
                        'sale_price' => $row['sale_price'] !== null ? (float) $row['sale_price'] : null,
                        'sku' => $row['sku'] !== null ? (string) $row['sku'] : null,
                        'stock' => (int) ($row['stock'] ?? 0),
                        'status' => (string) ($row['status'] ?? 'active'),
                        'is_featured' => (bool) ($row['is_featured'] ?? false),
                        'images' => json_encode($media, JSON_UNESCAPED_SLASHES),
                        'category_id' => (int) ($row['category_id'] ?? 0),
                    ]);

                    $created++;
                });
            } catch (\Throwable $e) {
                $failed++;
                $errors[] = 'Row ' . ($row['row_number'] ?? '?') . ': ' . $e->getMessage();
            }
        }

        $request->session()->forget([
            'product_import_preview_rows',
            'product_import_valid_rows',
            'product_import_summary',
        ]);

        if ($created === 0) {
            return redirect()->route('admin.products.import.form')->with('error', 'Import failed. ' . implode(' | ', array_slice($errors, 0, 3)));
        }

        $message = "Import completed. Created {$created} products";
        if ($failed > 0) {
            $message .= ", failed {$failed}.";
        } else {
            $message .= '.';
        }

        return redirect()->route('admin.products')->with('success', $message);
    }

    private function parseAndValidateFile(UploadedFile $file): array
    {
        $rows = $this->readTabularRows($file);
        if (empty($rows)) {
            return [[], [], ['total_rows' => 0, 'valid_rows' => 0, 'invalid_rows' => 0]];
        }

        $headers = array_shift($rows);
        if (!is_array($headers)) {
            return [[], [], ['total_rows' => 0, 'valid_rows' => 0, 'invalid_rows' => 0]];
        }

        $headers = array_map(static fn (mixed $value): string => Str::of((string) $value)->trim()->lower()->toString(), $headers);
        $required = ['name', 'price', 'category'];

        foreach ($required as $key) {
            if (!in_array($key, $headers, true)) {
                return [
                    [[
                        'row_number' => 0,
                        'name' => '-',
                        'status' => 'invalid',
                        'errors' => ["Missing required column: {$key}"],
                    ]],
                    [],
                    ['total_rows' => 0, 'valid_rows' => 0, 'invalid_rows' => 1],
                ];
            }
        }

        $categories = Category::select(['id', 'name'])->get();
        $categoryByName = [];
        foreach ($categories as $category) {
            $categoryByName[Str::lower(trim((string) $category->name))] = $category->id;
        }

        $previewRows = [];
        $validRows = [];
        $rowIndex = 1;

        foreach ($rows as $line) {
            $rowIndex++;
            $data = [];
            foreach ($headers as $index => $key) {
                $data[$key] = isset($line[$index]) ? trim((string) $line[$index]) : '';
            }

            if ($this->isEffectivelyEmptyRow($data)) {
                continue;
            }

            $errors = [];
            $name = (string) ($data['name'] ?? '');
            if ($name === '') {
                $errors[] = 'Name is required.';
            }

            $description = (string) ($data['description'] ?? '');
            if ($description === '') {
                $description = $name;
            }

            $price = $this->toFloatOrNull($data['price'] ?? null);
            if ($price === null || $price <= 0) {
                $errors[] = 'Price must be a positive number.';
            }

            $salePrice = $this->toFloatOrNull($data['sale_price'] ?? null);
            if ($salePrice !== null && $salePrice < 0) {
                $errors[] = 'Sale price cannot be negative.';
            }

            $stock = $this->toIntOrNull($data['stock'] ?? null);
            if ($stock === null) {
                $stock = 0;
            }
            if ($stock < 0) {
                $errors[] = 'Stock cannot be negative.';
            }

            $categoryRaw = (string) ($data['category'] ?? '');
            $categoryId = null;
            if ($categoryRaw === '') {
                $errors[] = 'Category is required.';
            } elseif (ctype_digit($categoryRaw)) {
                $numeric = (int) $categoryRaw;
                $categoryId = Category::where('id', '=', $numeric, 'and')->exists() ? $numeric : null;
                if ($categoryId === null) {
                    $errors[] = 'Category ID not found: ' . $categoryRaw;
                }
            } else {
                $lookup = Str::lower(trim($categoryRaw));
                $categoryId = $categoryByName[$lookup] ?? null;
                if ($categoryId === null) {
                    $errors[] = 'Category not found: ' . $categoryRaw;
                }
            }

            $status = Str::lower((string) ($data['status'] ?? 'active'));
            if (!in_array($status, ['active', 'inactive', 'draft'], true)) {
                $status = 'active';
            }

            $isFeatured = $this->toBoolean((string) ($data['is_featured'] ?? '0'));
            $media = array_values(array_unique(array_filter(array_merge(
                $this->splitMediaList((string) ($data['image_urls'] ?? ($data['images'] ?? ($data['image_files'] ?? '')))),
                $this->splitMediaList((string) ($data['video_urls'] ?? ($data['videos'] ?? ($data['video_files'] ?? ''))))
            ))));

            $previewRows[] = [
                'row_number' => $rowIndex,
                'name' => $name !== '' ? $name : '-',
                'status' => empty($errors) ? 'valid' : 'invalid',
                'errors' => $errors,
                'price' => $price,
                'category' => $categoryRaw,
                'media_count' => count($media),
            ];

            if (empty($errors)) {
                $validRows[] = [
                    'row_number' => $rowIndex,
                    'name' => $name,
                    'description' => $description,
                    'price' => $price,
                    'sale_price' => $salePrice,
                    'stock' => $stock,
                    'sku' => ($data['sku'] ?? '') !== '' ? (string) $data['sku'] : null,
                    'status' => $status,
                    'is_featured' => $isFeatured,
                    'category_id' => $categoryId,
                    'media' => $media,
                ];
            }
        }

        $summary = [
            'total_rows' => count($previewRows),
            'valid_rows' => count($validRows),
            'invalid_rows' => count($previewRows) - count($validRows),
        ];

        return [$previewRows, $validRows, $summary];
    }

    private function readTabularRows(UploadedFile $file): array
    {
        $extension = Str::lower((string) $file->getClientOriginalExtension());
        if ($extension === 'xlsx') {
            return $this->readXlsxRows($file);
        }

        return $this->readCsvRows($file);
    }

    private function readCsvRows(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        if ($path === false) {
            return [];
        }

        $handle = fopen($path, 'rb');
        if ($handle === false) {
            return [];
        }

        $rows = [];
        while (($line = fgetcsv($handle)) !== false) {
            $rows[] = $line;
        }
        fclose($handle);

        return $rows;
    }

    private function readXlsxRows(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        if ($path === false || !class_exists(ZipArchive::class)) {
            return [];
        }

        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            return [];
        }

        $sharedStrings = $this->readSharedStrings($zip);
        $sheetXml = $zip->getFromName('xl/worksheets/sheet1.xml');
        $zip->close();

        if (!is_string($sheetXml) || trim($sheetXml) === '') {
            return [];
        }

        $sheet = simplexml_load_string($sheetXml);
        if (!$sheet instanceof SimpleXMLElement || !isset($sheet->sheetData->row)) {
            return [];
        }

        $rows = [];
        foreach ($sheet->sheetData->row as $row) {
            $cells = [];
            foreach ($row->c as $cell) {
                $reference = (string) ($cell['r'] ?? '');
                $columnIndex = $this->columnReferenceToIndex($reference);
                $rawValue = (string) ($cell->v ?? '');
                $value = '';

                $type = (string) ($cell['t'] ?? '');
                if ($type === 's') {
                    $value = $sharedStrings[(int) $rawValue] ?? '';
                } elseif ($type === 'inlineStr') {
                    $value = trim((string) ($cell->is->t ?? ''));
                } else {
                    $value = trim($rawValue);
                }

                if ($columnIndex >= 0) {
                    $cells[$columnIndex] = $value;
                }
            }

            if (empty($cells)) {
                continue;
            }

            ksort($cells);
            $max = max(array_keys($cells));
            $line = array_fill(0, $max + 1, '');
            foreach ($cells as $i => $v) {
                $line[$i] = $v;
            }
            $rows[] = $line;
        }

        return $rows;
    }

    private function readSharedStrings(ZipArchive $zip): array
    {
        $shared = $zip->getFromName('xl/sharedStrings.xml');
        if (!is_string($shared) || trim($shared) === '') {
            return [];
        }

        $xml = simplexml_load_string($shared);
        if (!$xml instanceof SimpleXMLElement || !isset($xml->si)) {
            return [];
        }

        $values = [];
        foreach ($xml->si as $item) {
            if (isset($item->t)) {
                $values[] = (string) $item->t;
                continue;
            }

            if (!isset($item->r)) {
                $values[] = '';
                continue;
            }

            $parts = [];
            foreach ($item->r as $run) {
                $parts[] = (string) ($run->t ?? '');
            }
            $values[] = implode('', $parts);
        }

        return $values;
    }

    private function columnReferenceToIndex(string $cellReference): int
    {
        $letters = preg_replace('/[^A-Z]/', '', strtoupper($cellReference));
        if ($letters === null || $letters === '') {
            return -1;
        }

        $index = 0;
        $length = strlen($letters);
        for ($i = 0; $i < $length; $i++) {
            $index = ($index * 26) + (ord($letters[$i]) - 64);
        }

        return $index - 1;
    }

    private function splitMediaList(string $value): array
    {
        if ($value === '') {
            return [];
        }

        $parts = preg_split('/[\|\n,]+/', $value) ?: [];

        $normalized = [];
        foreach ($parts as $item) {
            $media = $this->normalizeMediaValue((string) $item);
            if ($media !== null) {
                $normalized[] = $media;
            }
        }

        return array_values(array_unique($normalized));
    }

    private function normalizeMediaValue(string $value): ?string
    {
        $trimmed = trim($value);
        if ($trimmed === '') {
            return null;
        }

        if (Str::startsWith($trimmed, ['http://', 'https://', '/'])) {
            return $trimmed;
        }

        $resolved = $this->resolveLocalMediaPath($trimmed);
        if ($resolved !== null) {
            return $resolved;
        }

        return null;
    }

    private function prepareImportMedia(array $mediaItems, array &$errors = []): array
    {
        $prepared = [];

        foreach ($mediaItems as $item) {
            if (!is_string($item) || trim($item) === '') {
                continue;
            }

            $normalized = trim($item);
            if (Str::startsWith($normalized, ['http://', 'https://'])) {
                $prepared[] = $normalized;
                continue;
            }

            if (!Str::startsWith($normalized, '/')) {
                $normalized = '/' . ltrim(str_replace('\\', '/', $normalized), '/');
            }

            $localPath = public_path(ltrim($normalized, '/'));
            if (!is_file($localPath)) {
                $errors[] = 'Media file not found: ' . $item;
                continue;
            }

            try {
                $uploadedFile = new UploadedFile(
                    $localPath,
                    basename($localPath),
                    mime_content_type($localPath) ?: null,
                    null,
                    true
                );
                $uploaded = CloudinaryService::uploadFile($uploadedFile, 'product-imports');
                if (!empty($uploaded['url'])) {
                    $prepared[] = $uploaded['url'];
                    continue;
                }
            } catch (\Throwable $e) {
                $errors[] = 'Cloudinary upload failed for ' . $item . ': ' . $e->getMessage();
            }

            $prepared[] = $normalized;
        }

        return array_values(array_unique($prepared));
    }

    private function isXlsxFile(UploadedFile $file): bool
    {
        return Str::lower((string) $file->getClientOriginalExtension()) === 'xlsx';
    }

    private function supportsXlsx(): bool
    {
        return class_exists(ZipArchive::class);
    }

    private function resolveLocalMediaPath(string $value): ?string
    {
        $relative = ltrim(str_replace('\\', '/', trim($value)), '/');
        if ($relative === '') {
            return null;
        }

        $candidates = [
            $relative,
            'import-media/' . $relative,
            'uploads/' . $relative,
            'storage/' . $relative,
        ];

        foreach ($candidates as $candidate) {
            $normalized = preg_replace('#/+#', '/', trim($candidate, '/'));
            if (!is_string($normalized) || $normalized === '') {
                continue;
            }

            if (is_file(public_path($normalized))) {
                return '/' . $normalized;
            }
        }

        return null;
    }

    private function toFloatOrNull(mixed $value): ?float
    {
        if ($value === null) {
            return null;
        }

        $normalized = str_replace(',', '', trim((string) $value));
        if ($normalized === '') {
            return null;
        }

        return is_numeric($normalized) ? (float) $normalized : null;
    }

    private function toIntOrNull(mixed $value): ?int
    {
        if ($value === null) {
            return null;
        }

        $normalized = trim((string) $value);
        if ($normalized === '' || !is_numeric($normalized)) {
            return null;
        }

        return (int) $normalized;
    }

    private function toBoolean(string $value): bool
    {
        return in_array(Str::lower(trim($value)), ['1', 'true', 'yes', 'y', 'on'], true);
    }

    private function isEffectivelyEmptyRow(array $data): bool
    {
        foreach ($data as $value) {
            if (trim((string) $value) !== '') {
                return false;
            }
        }

        return true;
    }
}
