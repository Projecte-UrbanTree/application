<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'final_price',
        'status',
    ];

    public function sensors(): HasMany
    {
        return $this->hasMany(Sensor::class, 'contract_id');
    }

    public function zones(): HasMany
    {
        return $this->hasMany(Zone::class, 'contract_id');
    }

    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'contract_id');
    }

    public function workers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'contract_user');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'contract_id');
    }
}
