<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class WorkOrder extends Model
{
    protected $fillable = [
        'date',
        'status',
        'contract_id',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function workReports()
    {
        return $this->belongsTo(WorkReport::class, 'work_order_id');
    }

    public function workOrdersBlocks()
    {
        return $this->hasMany(WorkOrderBlock::class, 'work_order_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'work_order_users', 'work_order_id', 'user_id')->withTimestamps();
    }
}
