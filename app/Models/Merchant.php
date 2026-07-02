<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Merchant extends Model
{
    protected $table = 'merchants';

    protected $fillable = ['name', 'email'];

    public function payments(): HasMany
    {
        return $this->hasMany(PaymentResolution::class);
    }
}
