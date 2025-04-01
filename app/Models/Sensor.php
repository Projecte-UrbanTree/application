<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [
        'dev_eui', // Cambiado de 'device_eui' a 'dev_eui'
        'name',
        'latitude',
        'longitude',
        'contract_id',
    ];

    public $incrementing = true;
    protected $keyType = 'integer';

    public function contracts()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function scopeUniqueByEuiAndName($query)
    {
        return $query->select('id', 'dev_eui', 'name', 'latitude', 'longitude', 'contract_id')
            ->groupBy('dev_eui', 'name');
    }

    public function scopeUniqueByDeviceEui($query)
    {
        return $query->select('id', 'dev_eui', 'name', 'latitude', 'longitude', 'contract_id')
            ->groupBy('dev_eui');
    }

    public function scopeUniqueByDevEui($query)
    {
        return $query->select('id', 'dev_eui', 'name', 'latitude', 'longitude', 'contract_id')
            ->groupBy('dev_eui');
    }
}
