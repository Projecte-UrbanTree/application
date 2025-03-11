<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Resource extends Model
{
    protected $fillable = [
        'name',
        'description',
        'resource_type_id',
    ];

    public function resourceType(): BelongsTo
    {
        return $this->belongsTo(ResourceType::class, 'resource_type_id');
    }

    public function workReports(): BelongsToMany
    {
        return $this->belongsToMany(WorkReport::class, 'work_report_resources', 'resource_id', 'work_report_id')->withTimestamps();
    }
}
