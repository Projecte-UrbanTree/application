<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Contract
 *
 * Represents a contract in the application.
 */
class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'final_price',
        'status',
    ];

    /**
     * Get the sensors associated with the contract.
     */
    public function sensors(): HasMany
    {
        return $this->hasMany(Sensor::class, 'contract_id');
    }

    /**
     * Get the zones associated with the contract.
     */
    public function zones(): HasMany
    {
        return $this->hasMany(Zone::class, 'contract_id');
    }

    /**
     * Get the work orders associated with the contract.
     */
    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'contract_id');
    }

    /**
     * Get the workers associated with the contract.
     */
    public function workers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'contract_user');
    }

    /**
     * Get the resources associated with the contract.
     */
    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'contract_id');
    }
}
