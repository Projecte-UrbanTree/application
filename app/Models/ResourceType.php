<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ResourceType
 *
 * Represents a type of resource in the application.
 */
class ResourceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the resources associated with the resource type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function resources()
    {
        return $this->hasMany(Resource::class, 'resource_type_id');
    }
}
