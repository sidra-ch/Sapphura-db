<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string|null $public_id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property float $price
 * @property float|null $sale_price
 * @property string|null $sku
 * @property int $stock
 * @property string $status
 * @property bool $is_featured
 * @property string|null $images
 * @property int|null $category_id
 * @property int|null $subcategory_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'public_id', 'name', 'slug', 'description', 'price', 'sale_price', 'sku',
        'barcode', 'cost_price', 'wholesale_price', 'tax_percentage', 'min_order_qty',
        'stock', 'status', 'is_featured', 'images', 'category_id', 'subcategory_id', 'brand',
    ];

    protected $casts = [
        'price' => 'float',
        'sale_price' => 'float',
        'cost_price' => 'float',
        'wholesale_price' => 'float',
        'tax_percentage' => 'float',
        'is_featured' => 'boolean',
    ];

    public static function generateUniqueSlug(string $name, ?int $ignoreProductId = null): string
    {
        $baseSlug = Str::slug($name);
        if ($baseSlug === '') {
            $baseSlug = 'product';
        }

        $existingSlugs = static::query()
            ->when($ignoreProductId !== null, fn ($query) => $query->where('id', '!=', $ignoreProductId))
            ->where(function ($query) use ($baseSlug) {
                $query->where('slug', $baseSlug)
                    ->orWhere('slug', 'like', $baseSlug . '-%');
            })
            ->pluck('slug')
            ->filter(fn ($slug) => is_string($slug) && $slug !== '')
            ->values();

        if (! $existingSlugs->contains($baseSlug)) {
            return $baseSlug;
        }

        $maxSuffix = $existingSlugs
            ->map(function (string $slug) use ($baseSlug) {
                if ($slug === $baseSlug) {
                    return 1;
                }

                if (! preg_match('/^' . preg_quote($baseSlug, '/') . '-(\d+)$/', $slug, $matches)) {
                    return null;
                }

                return (int) $matches[1];
            })
            ->filter(fn ($suffix) => is_int($suffix))
            ->max();

        return $baseSlug . '-' . (((int) $maxSuffix) + 1);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function productTags(): HasMany
    {
        return $this->hasMany(ProductTag::class);
    }

    public function inventoryLogs(): HasMany
    {
        return $this->hasMany(InventoryLog::class);
    }

    public function mediaItems(): array
    {
        $rawItems = json_decode($this->images ?: '[]', true);
        if (!is_array($rawItems)) {
            return [];
        }

        return collect($rawItems)
            ->map(function ($item) {
                if (!is_string($item)) {
                    return null;
                }

                $url = $this->normalizeMediaUrl($item);
                if ($url === null) {
                    return null;
                }

                return [
                    'url' => $url,
                    'type' => $this->inferMediaTypeFromUrl($url),
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    public function imageMediaItems(): array
    {
        return array_values(array_filter($this->mediaItems(), fn (array $item) => $item['type'] === 'image'));
    }

    public function primaryImageUrl(): string
    {
        $primaryImage = $this->imageMediaItems()[0]['url'] ?? null;
        return $primaryImage ?: asset('logo-1.png');
    }

    private function normalizeMediaUrl(string $value): ?string
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if (Str::startsWith($value, ['http://', 'https://', '//', 'data:', '/'])) {
            return $value;
        }

        return '/' . ltrim($value, '/');
    }

    private function inferMediaTypeFromUrl(string $url): string
    {
        if (str_contains($url, '/video/upload/')) {
            return 'video';
        }

        $path = parse_url($url, PHP_URL_PATH);
        $extension = strtolower(pathinfo((string) $path, PATHINFO_EXTENSION));

        return in_array($extension, ['mp4', 'mov', 'avi', 'webm', 'm4v'], true) ? 'video' : 'image';
    }
}
