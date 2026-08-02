<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsappMedia extends Model
{
    protected $table = 'whatsapp_media';

    protected $fillable = [
        'from_number',
        'media_url',
        'cloudinary_url',
        'cloudinary_public_id',
        'type',
        'caption',
        'category_id',
        'uploaded_to_cloudinary',
    ];

    protected $casts = [
        'uploaded_to_cloudinary' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
