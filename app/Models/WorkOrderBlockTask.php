<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderBlockTask extends Model
{
    protected $fillable = [
        'status',
        'spent_time',
        'element_type_id',
        'tree_type_id',
        'task_type_id',
        'work_order_block_id',
    ];

    public function elementType()
    {
        return $this->belongsTo(ElementType::class, 'element_type_id');
    }

    public function treeType()
    {
        return $this->belongsTo(TreeType::class, 'tree_type_id');
    }

    public function tasksType()
    {
        return $this->belongsTo(TaskType::class, 'task_type_id');
    }

    public function workOrderBlock()
    {
        return $this->belongsTo(WorkOrderBlock::class, 'work_order_block_id');
    }
}
