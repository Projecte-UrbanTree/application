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

    public function workOrders()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }

    public function workReportResources()
    {
        return $this->hasMany(WorkReportResource::class, 'work_report_id');
    }
}
