<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class WorkOrder
 *
 * Represents a work order in the application.
 */
class WorkOrder extends Model
{
    protected $fillable = [
        'date',
        'status',
        'contract_id',
    ];

    /**
     * Get the contract associated with the work order.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    /**
     * Get the work reports associated with the work order.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workReports()
    {
        return $this->hasMany(WorkReport::class, 'work_order_id');
    }

    /**
     * Get the blocks associated with the work order.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workOrdersBlocks()
    {
        return $this->hasMany(WorkOrderBlock::class, 'work_order_id');
    }

    /**
     * Get the users associated with the work order.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'work_order_users', 'work_order_id', 'user_id')->withTimestamps();
    }
}
