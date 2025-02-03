<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TreeType extends Model
{
    protected $fillable = [
        'family',
        'genus',
        'species',
    ];
    public function elements()
    {
        return $this->hasMany(Element::class, 'tree_type_id');
    }
    public function workOrderBlockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'tree_type_id');
    }
}
