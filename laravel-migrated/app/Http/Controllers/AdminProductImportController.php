<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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
            'csv_file' => 'required|file|mimetypes:text/plain,text/csv,text/tsv,application/csv,application/vnd.ms-excel|max:5120',
        ]);

        $csv = $request->file('csv_file');
        if (!$csv instanceof UploadedFile) {
            return back()->with('error', 'CSV file upload failed. Please try again.');
        }

        [$previewRows, $validRows, $summary] = $this->parseAndValidateCsv($csv);

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
                DB::transaction(function () use ($row, &$created, &$slugSet): void {
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
                        'images' => json_encode($row['media'] ?? [], JSON_UNESCAPED_SLASHES),
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

    private function parseAndValidateCsv(UploadedFile $file): array
    {
        $path = $file->getRealPath();
        if ($path === false) {
            return [[], [], ['total_rows' => 0, 'valid_rows' => 0, 'invalid_rows' => 0]];
        }

        $handle = fopen($path, 'rb');
        if ($handle === false) {
            return [[], [], ['total_rows' => 0, 'valid_rows' => 0, 'invalid_rows' => 0]];
        }

        $headers = fgetcsv($handle);
        if (!is_array($headers)) {
            fclose($handle);
            return [[], [], ['total_rows' => 0, 'valid_rows' => 0, 'invalid_rows' => 0]];
        }

        $headers = array_map(static fn (mixed $value): string => Str::of((string) $value)->trim()->lower()->toString(), $headers);
        $required = ['name', 'price', 'category'];

        foreach ($required as $key) {
            if (!in_array($key, $headers, true)) {
                fclose($handle);
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

        while (($line = fgetcsv($handle)) !== false) {
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
                $categoryId = Category::where('id', $numeric)->exists() ? $numeric : null;
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

        fclose($handle);

        $summary = [
            'total_rows' => count($previewRows),
            'valid_rows' => count($validRows),
            'invalid_rows' => count($previewRows) - count($validRows),
        ];

        return [$previewRows, $validRows, $summary];
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

        return '/' . ltrim(str_replace('\\', '/', $trimmed), '/');
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
