<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function workOrderBlock()
    {
        return $this->belongsToMany(WorkOrderBlock::class, 'work_order_block_task_types', 'task_type_id', 'work_order_block_id')->withTimestamps();
    }
}
