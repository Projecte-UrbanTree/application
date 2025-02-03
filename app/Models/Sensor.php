<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $fillable = [
        'contract_id',
    ];
    public function contracts()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }
}
