<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [
        'device_eui',
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
        return $this->belongsTo(Contract::class, 'contract_id'); // Relació amb el model Contract
    }
}
