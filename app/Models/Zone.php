<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Importar el trait
use Illuminate\Database\Eloquent\Model;

/**
 * Class Zone
 *
 * Represents a zone in the application.
 */
class Zone extends Model
{
    use HasFactory; // Agregar el trait HasFactory

    protected $fillable = [
        'name',
        'description',
        'color',
        'contract_id',
    ];

    /**
     * Get the contract associated with the zone.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    /**
     * Get the work order blocks associated with the zone.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function workOrderBlocks()
    {
        return $this->belongsToMany(WorkOrderBlock::class, 'work_order_block_zones', 'zone_id', 'work_order_block_id')->withTimestamps();
    }

    /**
     * Get the points associated with the zone.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function points()
    {
        return $this->hasMany(Point::class, 'zone_id');
    }
}
