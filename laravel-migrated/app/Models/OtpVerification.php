<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class OtpVerification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'otp_hash',
        'otp_code',
        'purpose',
        'expires_at',
        'attempts',
        'consumed_at',
        'created_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'consumed_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function getOtpHashAttribute(mixed $value): ?string
    {
        $column = $this->resolveOtpStorageColumn();

        return $this->attributes[$column] ?? $value ?? null;
    }

    public function setOtpHashAttribute(mixed $value): void
    {
        $this->attributes[$this->resolveOtpStorageColumn()] = $value;
    }

    public function getOtpCodeAttribute(mixed $value): ?string
    {
        return $this->getOtpHashAttribute($value);
    }

    public function setOtpCodeAttribute(mixed $value): void
    {
        $this->setOtpHashAttribute($value);
    }

    protected function resolveOtpStorageColumn(): string
    {
        if (Schema::hasColumn($this->getTable(), 'otp_hash')) {
            return 'otp_hash';
        }

        if (Schema::hasColumn($this->getTable(), 'otp_code')) {
            return 'otp_code';
        }

        return 'otp_hash';
    }
}
