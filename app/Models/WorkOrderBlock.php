<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class WorkOrderBlock
 *
 * Represents a block within a work order.
 *
 * @package App\Models
 */
class WorkOrderBlock extends Model
{
    protected $fillable = [
        'notes',
        'work_order_id',
    ];

    /**
     * Get the work order associated with the block.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }

    /**
     * Get the task types associated with the block.
     *
     * @return BelongsToMany
     */
    public function taskTypes(): BelongsToMany
    {
        return $this->belongsToMany(TaskType::class, 'work_order_block_tasks', 'work_order_block_id', 'task_type_id')->withTimestamps();
    }

    /**
     * Get the zones associated with the block.
     *
     * @return BelongsToMany
     */
    public function zones()
    {
        return $this->belongsToMany(Zone::class, 'work_order_block_zones', 'work_order_block_id', 'zone_id')->withTimestamps();
    }

    /**
     * Get the tasks associated with the block.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function blockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'work_order_block_id');
    }
}
