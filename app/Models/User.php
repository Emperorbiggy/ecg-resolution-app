<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAccountant(): bool
    {
        return $this->role === 'accountant';
    }

    public function isResolutionOfficer(): bool
    {
        return $this->role === 'resolution_officer';
    }

    public function hasRole(string|array $roles): bool
    {
        return in_array($this->role, (array) $roles);
    }

    public function getRoleLabelAttribute(): string
    {
        return config('roles.labels')[$this->role] ?? $this->role;
    }

    public function receivedPayments(): HasMany
    {
        return $this->hasMany(PaymentResolution::class, 'received_by');
    }

    public function resolvedPayments(): HasMany
    {
        return $this->hasMany(PaymentResolution::class, 'resolved_by');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }
}
