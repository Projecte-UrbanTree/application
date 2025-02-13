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

    public function taskTypes(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'work_order_block_tasks', 'work_order_block_id', 'task_id')->withTimestamps();
    }

    public function zones()
    {
        return $this->belongsToMany(Zone::class, 'work_order_block_zones', 'work_order_block_id', 'zone_id')->withTimestamps();
    }
}
