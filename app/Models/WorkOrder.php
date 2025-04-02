<?php

namespace App\Models;

use App\Traits\FiltersByContract;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    use FiltersByContract;

    protected $fillable = [
        'date',
        'status',
        'contract_id',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'work_order_users');
    }

    public function workReport()
    {
        return $this->hasOne(WorkReport::class, 'work_order_id');
    }

    public function workOrderBlocks()
    {
        return $this->hasMany(WorkOrderBlock::class, 'work_order_id');
    }
}
