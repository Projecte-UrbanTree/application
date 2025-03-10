<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'final_price',
        'status',
    ];

    public function sensors()
    {
        return $this->hasMany(Sensor::class, 'contract_id');
    }

    public function zones()
    {
        return $this->hasMany(Zone::class, 'contract_id');
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class, 'contract_id');
    }
}
