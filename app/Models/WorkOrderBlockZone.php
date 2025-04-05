<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class WorkOrderBlockZone
 *
 * Represents the relationship between a work order block and a zone.
 *
 * @package App\Models
 */
class WorkOrderBlockZone extends Model
{
    protected $fillable = [
        'zone_id',
        'work_order_block_id',
    ];

    /**
     * Get the work order block associated with the zone.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workOrderBlock()
    {
        return $this->belongsTo(WorkOrderBlock::class, 'work_order_block_id');
    }

    /**
     * Get the zone associated with the work order block.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function zones()
    {
        return $this->belongsTo(Zone::class, 'zone_id');
    }
}
