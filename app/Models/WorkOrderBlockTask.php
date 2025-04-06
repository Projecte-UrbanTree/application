<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class WorkOrderBlockTask
 *
 * Represents a task within a work order block.
 */
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

    /**
     * Get the element type associated with the task.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function elementType()
    {
        return $this->belongsTo(ElementType::class, 'element_type_id');
    }

    /**
     * Get the tree type associated with the task.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function treeType()
    {
        return $this->belongsTo(TreeType::class, 'tree_type_id');
    }

    /**
     * Get the task type associated with the task.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function tasksType()
    {
        return $this->belongsTo(TaskType::class, 'task_type_id');
    }

    /**
     * Get the work order block associated with the task.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workOrderBlock()
    {
        return $this->belongsTo(WorkOrderBlock::class, 'work_order_block_id');
    }
}
