<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait FiltersByContract
{
    public function scopeFilterByContract(Builder $query, ?string $contract): void
    {
        if ($contract > 0) {
            $query->where('contract_id', $contract);
        } else {
            $query;
        }
    }
}
