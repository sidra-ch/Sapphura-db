<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    protected $fillable = [
        'order_id',
        'provider',
        'merchant_reference',
        'provider_transaction_id',
        'amount',
        'currency',
        'status',
        'request_payload',
        'response_payload',
        'callback_payload',
        'signature_valid',
        'reconciled_at',
    ];

    protected $casts = [
        'request_payload' => 'array',
        'response_payload' => 'array',
        'callback_payload' => 'array',
        'signature_valid' => 'boolean',
        'reconciled_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
