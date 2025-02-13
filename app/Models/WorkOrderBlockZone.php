<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderBlockZone extends Model
{
    protected $fillable = [
        'zone_id',
        'work_order_block_id',
    ];

    public function workOrderBlock()
    {
        return $this->belongsTo(WorkOrderBlock::class, 'work_order_block_id');
    }

    public function zones()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
