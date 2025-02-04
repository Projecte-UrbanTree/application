<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrderUser extends Model
{
    protected $fillable = [
        'user_id',
        'work_order_id',
    ];

    public function workOrders()
    {
        return $this->belongsTo(WorkOrder::class, 'work_order_id');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
