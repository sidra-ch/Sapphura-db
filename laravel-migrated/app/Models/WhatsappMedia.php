<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'uploaded_to_cloudinary',
    ];

    protected $casts = [
        'uploaded_to_cloudinary' => 'boolean',
    ];
}
