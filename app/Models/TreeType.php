<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TreeType
 *
 * Represents a type of tree in the application.
 */
class TreeType extends Model
{
    protected $fillable = [
        'family',
        'genus',
        'species',
    ];

    /**
     * Get the elements associated with the tree type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function elements()
    {
        return $this->hasMany(Element::class, 'tree_type_id');
    }

    /**
     * Get the work order block tasks associated with the tree type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workOrderBlockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'tree_type_id');
    }
}
