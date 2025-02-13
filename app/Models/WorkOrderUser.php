<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderUser extends Model
{
    protected $fillable = [
        'user_id',
        'work_order_id',
    ];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
