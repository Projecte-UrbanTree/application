<?php

namespace App\Models;

use App\Traits\FiltersByContract;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use FiltersByContract;

    protected $fillable = [
        'name',
        'description',
        'color',
        'contract_id',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function workOrderBlocks()
    {
        return $this->belongsToMany(WorkOrderBlock::class, 'work_order_block_zones', 'zone_id', 'work_order_block_id')->withTimestamps();
    }

    public function points()
    {
        return $this->hasMany(Point::class, 'zone_id');
    }
}
