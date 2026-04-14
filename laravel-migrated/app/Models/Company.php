<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'company_name', 'company_email', 'phone', 'address', 'city', 'country',
        'ntn', 'strn', 'contact_person_name', 'contact_person_phone',
        'status', 'credit_limit', 'payment_terms', 'notes',
    ];

    protected $casts = [
        'credit_limit' => 'float',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
