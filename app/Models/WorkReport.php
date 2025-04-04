<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class WorkReport
 *
 * Represents a work report in the application.
 *
 * @package App\Models
 */
class WorkReport extends Model
{
    protected $fillable = [
        'observation',
        'spent_fuel',
        'work_order_id',
        'report_status',
        'report_incidents',
    ];

    protected $with = ['workOrder', 'resources', 'workReportResources'];

    /**
     * Get the work order associated with the work report.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }

    /**
     * Get the resources associated with the work report.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function resources()
    {
        return $this->belongsToMany(Resource::class, 'work_report_resources', 'work_report_id', 'resource_id')->withTimestamps();
    }

    /**
     * Get the work report resources associated with the work report.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workReportResources()
    {
        return $this->hasMany(WorkReportResource::class, 'work_report_id');
    }
}
