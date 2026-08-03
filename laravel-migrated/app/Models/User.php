<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @property int $id
 * @property string|null $public_id
 * @property string|null $clerk_id
 * @property string|null $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $role
 * @property int|null $role_id
 * @property int|null $company_id
 * @property bool $is_active
 * @property string|null $otp
 * @property \Illuminate\Support\Carbon|null $otp_expiry
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'users';

    public $timestamps = true;

    const CREATED_AT = 'created_at';

    const UPDATED_AT = 'updated_at';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'public_id',
        'clerk_id',
        'name',
        'email',
        'phone',
        'role',
        'role_id',
        'company_id',
        'is_active',
        'otp',
        'otp_expiry',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getAuthPassword()
    {
        return $this->password;
    }

    public function getCreatedAtAttribute(mixed $value)
    {
        return $value;
    }

    public function getUpdatedAtAttribute(mixed $value)
    {
        return $value;
    }

    public function getIsActiveAttribute(mixed $value)
    {
        return (bool) $value;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'otp_expiry' => 'datetime',
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function roleModel(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function hasPermission(string $permission): bool
    {
        if (!$this->role_id) return false;
        return $this->roleModel?->permissions()->where('name', $permission)->exists() ?? false;
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'admin' && $this->roleModel?->name === 'super_admin';
    }
}
