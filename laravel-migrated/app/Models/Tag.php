<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tag extends Model
{
    public $timestamps = false;

    protected $fillable = ['name'];

    public function productTags(): HasMany
    {
        return $this->hasMany(ProductTag::class);
    }
}
