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
        'task_id',
        'work_order_block_id',
    ];
    public function elementTypes()
    {
        return $this->belongsTo(ElementType::class, 'element_type_id');
    }
    public function treeTypes()
    {
        return $this->belongsTo(TreeType::class, 'tree_type_id');
    }
    public function tasks()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
    public function workOrderBlocks()
    {
        return $this->belongsTo(WorkOrderBlock::class, 'work_order_block_id');
    }
}
