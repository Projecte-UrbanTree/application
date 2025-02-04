<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    protected $fillable = [
        'name',
        'description',
        'color',
        'contract_id',
    ];

    public function contracts()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function workOrderBlockZones()
    {
        return $this->hasMany(WorkOrderBlockZone::class, 'zone_id');
    }

    public function points()
    {
        return $this->hasMany(Point::class, 'point_id');
    }
}
