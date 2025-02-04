<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkReportResource extends Model
{
    protected $fillable = [
        'work_report_id',
        'resource_id',
    ];

    public function workReports()
    {
        return $this->belongsTo(WorkReport::class, 'work_report_id');
    }

    public function resources()
    {
        return $this->belongsTo(Resource::class, 'resource_id');
    }
}
