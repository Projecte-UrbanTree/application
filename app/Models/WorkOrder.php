<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    protected $fillable = [
        'date',
        'status',
        'contract_id',
    ];
    public function contracts()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }
    public function workReports()
    {
        return $this->hasMany(WorkReport::class, 'work_order_id');
    }
    public function workOrdersBlocks()
    {
        return $this->hasMany(WorkOrderBlock::class, 'work_order_id');
    }
    public function workOrdersUsers(){
        return $this->hasMany(WorkOrderUser::class, 'work_order_id');
    }
}
