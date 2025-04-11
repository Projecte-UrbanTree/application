<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorHistory extends Model
{
    protected $table = 'sensor_history';

    protected $fillable = [
        'sensor_id',
        'temperature_soil',
        'temperature_air',
        'ph_soil',
        'humidity_soil',
        'conductivity_soil',
        'batery',
        'signal',
    ];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }
}
