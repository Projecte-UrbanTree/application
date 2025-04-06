<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Sensor
 *
 * Represents a sensor in the application.
 *
 * @package App\Models
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
    public function contracts()
    {
        return $this->belongsTo(Contract::class);
    }
}
