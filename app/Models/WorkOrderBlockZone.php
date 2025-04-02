<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderBlockZone extends Model
{
    protected $fillable = [
        'work_order_block_id',
        'zone_id',
    ];

    public function workOrderBlock()
    {
        return $this->belongsTo(WorkOrderBlock::class, 'work_order_block_id');
    }

    public function zone()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
