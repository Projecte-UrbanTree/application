<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderBlock extends Model
{
    protected $fillable = [
        'notes',
        'work_order_id',
    ];
    public function workOrders()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }
    public function workOrderBlockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'work_order_block_id');
    }
    public function workOrderBlockZones()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'work_order_block_id');
    }
}
