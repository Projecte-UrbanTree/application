<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $fillable = [
        'name',
        'description',
        'resource_type_id',
    ];

    public function resourceTypes()
    {
        return $this->belongsTo(ResourceType::class, 'resource_type_id');
    }

    public function workReportResources()
    {
        return $this->hasMany(WorkReportResource::class, 'resource_id');
    }
}
