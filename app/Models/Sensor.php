<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [
        'eui',
        'contract_id',
        'name',
        'longitude',
        'latitude',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
