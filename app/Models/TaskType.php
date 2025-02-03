<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskType extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function workOrderBlockTasks()
    {
        return $this->hasMany(WorkOrderBlockTask::class, 'task_type_id');
    }
}
