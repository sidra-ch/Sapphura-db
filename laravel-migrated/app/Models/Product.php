<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
