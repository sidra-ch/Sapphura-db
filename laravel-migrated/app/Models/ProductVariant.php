<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariant extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'product_id', 'size', 'color', 'material', 'sku', 'stock', 'price', 'image',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price' => 'float',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
