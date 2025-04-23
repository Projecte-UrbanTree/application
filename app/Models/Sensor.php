<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Sensor
 *
 * Represents a sensor in the application.
 */
class Sensor extends Model
{
    protected $fillable = [
        'eui',
        'contract_id',
        'name',
        'longitude',
        'latitude',
    ];

    /**
     * Get the contract associated with the sensor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }
}
