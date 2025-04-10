<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class Resource
 *
 * Represents a resource in the application.
 */
class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'name',
        'description',
        'resource_type_id',
        'unit_name',
        'unit_cost',
    ];

    /**
     * Get the contract associated with the resource.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the resource type associated with the resource.
     */
    public function resourceType(): BelongsTo
    {
        return $this->belongsTo(ResourceType::class, 'resource_type_id');
    }

    /**
     * Get the work reports associated with the resource.
     */
    public function workReports(): BelongsToMany
    {
        return $this->belongsToMany(WorkReport::class, 'work_report_resources', 'resource_id', 'work_report_id')->withTimestamps();
    }
}
