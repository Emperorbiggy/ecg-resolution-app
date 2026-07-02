<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentResolution extends Model
{
    protected $fillable = [
        'merchant_id',
        'ipn',
        'transaction_date',
        'merchant_name',
        'email',
        'phone',
        'bank',
        'account_number',
        'proof_of_payment',
        'accountant_comment',
        'resolution_status',
        'payment_status',
        'received_by',
        'resolved_by',
        'received_at',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'date',
            'received_at'      => 'datetime',
            'resolved_at'      => 'datetime',
        ];
    }

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    public function getBankLabelAttribute(): string
    {
        return config('roles.banks')[$this->bank] ?? $this->bank;
    }

    public function getResolutionStatusLabelAttribute(): string
    {
        return config('roles.resolution_statuses')[$this->resolution_status] ?? $this->resolution_status;
    }

    public function getPaymentStatusLabelAttribute(): string
    {
        return config('roles.payment_statuses')[$this->payment_status] ?? $this->payment_status;
    }

    public function getProofUrlAttribute(): string
    {
        return asset('storage/' . $this->proof_of_payment);
    }
}
