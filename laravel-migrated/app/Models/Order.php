<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'public_id', 'order_number', 'user_id', 'company_id',
        'total', 'subtotal', 'discount', 'discount_code', 'tax', 'shipping_cost', 'status',
        'shipping_name', 'shipping_phone', 'shipping_address', 'shipping_city',
        'shipping_postal_code', 'shipping_country',
        'billing_address', 'billing_city',
        'tracking_number', 'tracking_carrier',
        'payment_method', 'payment_status', 'notes', 'admin_notes',
        'cancel_reason', 'refunded_at',
    ];

    protected $casts = [
        'refunded_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class)->orderByDesc('created_at');
    }
}
