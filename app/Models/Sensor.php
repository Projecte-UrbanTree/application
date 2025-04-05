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
        'contract_id',
    ];

    /**
     * Get the contract associated with the sensor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function contracts()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }
}
