<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order_id
 * @property string $provider
 * @property string|null $merchant_reference
 * @property string|null $provider_transaction_id
 * @property float|null $amount
 * @property string|null $currency
 * @property string $status
 * @property array|null $request_payload
 * @property array|null $response_payload
 * @property array|null $callback_payload
 * @property bool|null $signature_valid
 * @property \Illuminate\Support\Carbon|null $reconciled_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
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
