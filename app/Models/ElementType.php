<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElementType extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'requires_tree_type',
        'description',
        'icon',
        'color',
    ];

    /**
     * Get the elements associated with this element type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function elements()
    {
        return $this->hasMany(Element::class, 'element_type_id');
    }

    /**
     * Get the work order block tasks associated with this element type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function workOrderBlockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'element_type_id');
    }
}
