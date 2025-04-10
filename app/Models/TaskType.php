<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TaskType
 *
 * Represents a type of task in the application.
 */
class TaskType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the work order blocks associated with the task type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function workOrderBlock()
    {
        return $this->belongsToMany(WorkOrderBlock::class, 'work_order_block_task_types', 'task_type_id', 'work_order_block_id')->withTimestamps();
    }
}
