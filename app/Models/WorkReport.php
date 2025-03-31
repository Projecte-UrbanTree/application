<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkReport extends Model
{
    protected $fillable = [
        'observation',
        'spent_fuel',
        'work_order_id',
        'report_status',
        'report_incidents',
    ];
    protected $with = ['workOrders', 'resources', 'workReportResources'];

    public function workOrders()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }

    public function resources()
    {
        return $this->belongsToMany(Resource::class, 'work_report_resources', 'work_report_id', 'resource_id')->withTimestamps();
    }
    public function workReportResources()
    {
        return $this->hasMany(WorkReportResource::class, 'work_report_id');
    }
}
