<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkReportResource extends Model
{
    protected $fillable = [
        'work_report_id',
        'resource_id',
    ];

    public function workReport()
    {
        return $this->belongsTo(WorkReport::class, 'work_report_id');
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class, 'resource_id');
    }
}
