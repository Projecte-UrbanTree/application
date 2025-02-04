<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElementType extends Model
{
    protected $fillable = [
        'name',
        'requires_tree_type',
        'description',
        'icon',
        'color',
    ];

    public function elements()
    {
        return $this->hasMany(Element::class, 'element_type_id');
    }

    public function workOrderBlockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'element_type_id');
    }
}
