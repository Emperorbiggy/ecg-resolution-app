<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'user_name',
        'user_email',
        'user_role',
        'action',
        'entity_type',
        'entity_id',
        'ipn',
        'description',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getActionLabelAttribute(): string
    {
        return config('roles.audit_actions')[$this->action] ?? $this->action;
    }
}
